import { DeviceSessionsService } from './../device-sessions/device-sessions.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { LoginMetaData } from './users.controller';
import { randomInt } from 'crypto';
import { AfterSignUpDto } from './dto/after-signup.dto';
import { PrivacyType } from 'src/helper/helper.enum';
import { ConfigService } from '@nestjs/config';
import { BeforeLoginDto } from './dto/before-login.dto';
import { AfterLoginDto } from './dto/after-login.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import * as fs from 'fs';
import { UserSearchService } from 'src/search-engine/user-search.service';
import { UserSearchBody } from 'src/search-engine/interfaces/user-search-body.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private redisService: RedisService,
    private diviceSessionsService: DeviceSessionsService,
    private readonly configService: ConfigService,
    @InjectQueue('sendEmail')
    private sendEmail: Queue,
    private readonly userSearchService: UserSearchService,
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  // Gửi OTP khi đăng nhập
  async beforeSignUp(email: string, username: string) {
    const userDb = await this.usersRepository.findOneBy({ email });

    if (userDb) {
      throw new BadRequestException(`Email ${email} has existed.`);
    }

    const otp = randomInt(100000, 999999).toString();

    await this.sendEmail.add(
      'sendOTP',
      {
        email: email,
        username: username,
        otp: otp,
        template: 'otp-signup-account',
      },
      { removeOnComplete: true },
    );

    await this.redisService.set(
      `otp-code:${email}`,
      otp,
      this.configService.get('TIME_OTP'),
    );

    return;
  }

  // Gửi OTP khi đăng nhập
  async beforeLogin(dto: BeforeLoginDto) {
    const userDb = await this.validateUser(dto.email, dto.password);

    const otp = randomInt(100000, 999999).toString();

    await this.sendEmail.add(
      'sendOTP',
      {
        email: userDb.email,
        username: userDb.username,
        otp: otp,
        template: 'otp-login-account',
      },
      { removeOnComplete: true },
    );

    await this.redisService.set(
      `otp-code:${userDb.email}`,
      otp,
      this.configService.get('TIME_OTP'),
    );
    return;
  }

  // Gửi OTP khi xóa tài khoản
  async beforeDelete(user: IUser) {
    const userDb = await this.findUserById(user.id);

    const otp = randomInt(100000, 999999).toString();

    await this.sendEmail.add(
      'sendOTP',
      {
        email: userDb.email,
        username: userDb.username,
        otp: otp,
        template: 'otp-delete-account',
      },
      { removeOnComplete: true },
    );

    await this.redisService.set(
      `otp-code:${userDb.email}`,
      otp,
      this.configService.get('TIME_OTP'),
    );
    return;
  }

  // Xử lý khi nhập OTP đăng nhập
  async afterlogin(dto: AfterLoginDto, metaData: LoginMetaData) {
    const user = await this.validateUser(dto.email, dto.password);

    const otp = await this.redisService.get(`otp-code:${dto.email}`);

    if (otp !== dto.otp)
      throw new BadRequestException('Mã OTP không đúng hoặc đã quá hạn');

    await this.redisService.del(`otp-code:${dto.email}`);

    return await this.diviceSessionsService.handleLogin(user.id, metaData);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !this.isValidPassword(password, user.password)) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }

  // Xử lý khi nhập OTP đăng kí
  async afterSignUp(dto: AfterSignUpDto) {
    try {
      const otp = await this.redisService.get(`otp-code:${dto.email}`);

      if (otp !== dto.otp)
        throw new BadRequestException('Mã OTP không đúng hoặc đã quá hạn');

      const hashPassword = this.getHashPassword(dto.password);

      const newUser = {
        email: dto.email,
        password: hashPassword,
        avatar: dto.avatar,
        username: dto.username,
        bio: dto.bio,
        website: dto.website,
        birthday: dto.birthday,
        gender: dto.gender,
        address: dto.address,
        privacy: PrivacyType.PUBLIC,
      };

      const userDb = await this.usersRepository.save(newUser);

      const userSearchBody: UserSearchBody = {
        id: userDb.id,
        email: userDb.email,
        username: userDb.username,
        avatar: userDb.avatar,
        bio: userDb.bio,
        website: userDb.website,
        gender: userDb.gender,
        address: userDb.address,
      };

      await this.userSearchService.createUser(userSearchBody);

      await this.sendEmail.add(
        'sendOTP',
        {
          email: dto.email,
          username: dto.username,
          template: 'signup-success',
        },
        { removeOnComplete: true },
      );

      await this.redisService.del(`otp-code:${dto.email}`);

      return { message: 'Đăng kí tài khoản thành công' };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // Xử lý khi nhập OTP xóa tài khoản
  async afterDelete(id: string, otp: string) {
    const user = await this.findUserById(id);
    const otpCache = await this.redisService.get(`otp-code:${user.email}`);

    if (otp !== otpCache)
      throw new BadRequestException('Mã OTP không đúng hoặc đã quá hạn');

    await this.usersRepository.delete({ id });

    await this.redisService.del(`user:${id}`);

    await this.redisService.del(`otp-code:${user.email}`);

    return { message: 'Xóa người dùng thành công' };
  }

  async findUserById(id: string): Promise<User> {
    try {
      const cacheKey = `user:id:${id}`;

      const cachedUser = await this.redisService.get<User>(cacheKey);
      if (cachedUser) {
        return cachedUser;
      }

      const user = await this.usersRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'password',
          'avatar',
          'username',
          'bio',
          'website',
          'birthday',
          'gender',
          'address',
          'privacy',
          'created_at',
          'updated_at',
        ],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.redisService.set(cacheKey, user, 300);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in findUserById:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(dto: UpdateUserDto, user: IUser, file: Express.Multer.File) {
    try {
      if (dto.username) {
        const userDb = await this.usersRepository.findOne({
          where: { username: dto.username },
        });

        if (userDb) {
          throw new BadRequestException(
            `Username ${dto.username} has existed.`,
          );
        }
      }
      if (!file) {
        await this.usersRepository.update(
          { id: user.id },
          {
            ...dto,
          },
        );
      } else {
        const findUser = await this.usersRepository.findOne({
          where: { id: user.id },
        });

        const avatar = findUser.avatar;

        if (avatar) {
          try {
            if (fs.existsSync(avatar)) {
              fs.unlinkSync(avatar);
            }
          } catch {
            throw new BadRequestException('Error when delete file');
          }
        }

        await this.usersRepository.update(
          { id: user.id },
          {
            ...dto,
            avatar: file.path,
          },
        );
      }
      await this.redisService.del(`user:${user.id}`);

      return {
        message: 'Cập nhật thành công',
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Lỗi khi cập nhật người dùng');
    }
  }
}
