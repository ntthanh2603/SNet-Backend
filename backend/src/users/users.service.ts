import { EmailService } from './email.service';
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
import { LoginUserDto } from './dto/login-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { LoginMetaData } from './users.controller';
import { randomInt } from 'crypto';
import { AfterSignUpDto } from './dto/after-signup.dto';
import { PrivacyType } from 'src/helper/helper.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private redisService: RedisService,
    private diviceSessionsService: DeviceSessionsService,
    private readonly emailService: EmailService,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async beforeSignUp(email: string, username: string) {
    const userDb = await this.usersRepository.findOneBy({ email });

    if (userDb) {
      throw new BadRequestException(`Email ${email} has existed.`);
    }

    const otp = randomInt(100000, 999999).toString();

    const res = await this.emailService.SendOtpSignUp(email, username, otp);

    if (res) {
      await this.redisService.set(`otp-code:${email}`, otp, 150);
      return;
    }

    throw new BadRequestException(`Lỗi khi gửi OTP về email ${email}`);
  }

  async beforeDelete(user: IUser) {
    const userDb = await this.findUserById(user.id);

    const otp = randomInt(100000, 999999).toString();

    const res = await this.emailService.SendOtpDelete(
      userDb.email,
      userDb.username,
      otp,
    );

    if (res) {
      await this.redisService.set(`otp-code:${userDb.email}`, otp, 150);
      return;
    }
    throw new BadRequestException(`Lỗi khi gửi OTP về email ${userDb.email}`);
  }

  async afterSignUp(dto: AfterSignUpDto) {
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
      createdAt: new Date(),
      privacy: PrivacyType.PUBLIC,
    };

    await this.usersRepository.save(newUser);

    await this.emailService.sendSignUpSuccess(dto.email, dto.username);

    await this.redisService.del(`otp-code:${dto.email}`);

    return { message: 'Đăng kí tài khoản thành công' };
  }

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
          'followerCount',
          'followedCount',
          'createdAt',
          'updatedAt',
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

  async updateProfile(dto: UpdateUserDto, user: IUser) {
    try {
      await this.usersRepository.update(
        { id: user.id },
        {
          ...dto,
        },
      );

      await this.redisService.del(`user:${user.id}`);

      return {
        message: 'Cập nhật thành công',
      };
    } catch {
      throw new InternalServerErrorException('Lỗi khi cập nhật người dùng');
    }
  }

  async login(dto: LoginUserDto, metaData: LoginMetaData) {
    const user = await this.validateUser(dto.email, dto.password);

    return await this.diviceSessionsService.handleLogin(user.id, metaData);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !this.isValidPassword(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
