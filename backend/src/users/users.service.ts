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
import { RegisterUserDto } from './dto/create-user.dto';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrivacyType } from 'src/helper/helper.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { LoginMetaData } from './users.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private diviceSessionsService: DeviceSessionsService,
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

  async register(dto: RegisterUserDto) {
    try {
      const userDb = await this.usersRepository.findOneBy({ email: dto.email });

      if (userDb) {
        throw new BadRequestException(`Email ${dto.email} đã tồn tại.`);
      }

      const hashPassword = this.getHashPassword(dto.password);

      const newUser = {
        email: dto.email,
        password: hashPassword,
        avatar: dto.avatar,
        username: dto.username,
        bio: dto.bio,
        website: dto.website,
        age: dto.age,
        gender: dto.gender,
        address: dto.address,
        createdAt: new Date(),
        privacy: PrivacyType.PUBLIC,
      };

      await this.usersRepository.save(newUser);

      return { message: 'Đăng kí tài khoản thành công' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Lỗi khi đăng kí tài khoản');
    }
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
          'age',
          'gender',
          'address',
          'privacy',
          'follower_count',
          'followed_count',
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

  async deleteUser(id: string) {
    try {
      await this.redisService.del(`user:${id}`);
      await this.usersRepository.delete({ id });
      return {
        message: 'Xóa người dùng thành công',
      };
    } catch {
      throw new InternalServerErrorException('Lỗi khi cập nhật người dùng');
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

  async processNewToken(
    refreshToken: string,
    response: Response,
    deviceId: string,
    ipAddress: string,
  ) {
    // try {
    //   const payload = this.jwtService.verify(refreshToken, {
    //     secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    //   });
    //   if (!payload || !payload.sub) {
    //     throw new BadRequestException('Invalid refresh token');
    //   }
    //   const user =
    //     await this.diviceSessionsService.findUserByToken(refreshToken);
    //   if (!user) {
    //     throw new BadRequestException('User not found or token invalid');
    //   }
    //   const { id, email } = user;
    //   const newAccessToken = this.jwtService.sign(
    //     { id, email },
    //     { expiresIn: '15m' },
    //   );
    //   response.cookie('access_token', newAccessToken, { httpOnly: true });
    //   return {
    //     access_token: newAccessToken,
    //     user: {
    //       id: user.id,
    //       email: user.email,
    //       username: user.username,
    //     },
    //   };
    // } catch {
    //   throw new BadRequestException('Refresh token invalid or expired');
    // }
  }
}
