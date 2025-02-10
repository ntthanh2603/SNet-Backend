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
import { PrivacyType, StatusType } from 'src/helper/helper.enum';
import * as fs from 'fs';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

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
    return await this.usersRepository.delete({ id });
  }

  async updateProfile(
    dto: UpdateUserDto,
    user: IUser,
    file: Express.Multer.File,
  ) {
    if (!file) {
      return await this.usersRepository.update(
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
        } catch (error) {
          console.error('Error deleting old avatar:', error);
        }
      }
      return await this.usersRepository.update(
        { id: user.id },
        {
          ...dto,
          avatar: file.path,
        },
      );
    }
  }

  async login(
    dto: LoginUserDto,
    response: Response,
    deviceId: string,
    ipAddress: string,
  ) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      id: user.id,
      deviceId: deviceId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    const session = {
      user_id: user.id,
      deviceId: deviceId,
      ipAddress: ipAddress,
      lastActive: new Date(),
      isActive: StatusType.ON,
      refreshToken: refreshToken,
    };

    await this.diviceSessionsService.saveRefreshToken(session);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Không thể truy cập từ JavaScript
      secure: true, // Chỉ gửi qua HTTPS
      sameSite: 'strict', // Chống CSRF
      path: '/users/refresh', // Chỉ gửi cookie khi gọi API làm mới token
    });

    return {
      accessToken: accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !this.isValidPassword(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async processNewToken(refreshToken: string, response: Response) {
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
