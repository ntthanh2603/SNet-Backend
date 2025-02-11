import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { DeviceSession } from './entities/device-session.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';
import { LoginMetaData } from 'src/users/users.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import addDay from 'src/helper/addDay';

export interface ISession {
  user_id: string;
  deviceId: string;
  ipAddress: string;
  lastActive: Date;
  refreshToken: string;
  expiredAt: number;
  createdAt: Date;
}

@Injectable()
export class DeviceSessionsService {
  constructor(
    @InjectRepository(DeviceSession)
    private repository: Repository<DeviceSession>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async logout(response: Response, user: IUser) {
    await this.repository.update({ user_id: user.id }, { refreshToken: '' });
    response.clearCookie('refresh_token');
    return user;
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.repository.findOne({
      where: { refreshToken: refreshToken },
    });
  };

  async updateToken(user_id: string, refreshToken: string) {
    return await this.repository.update({ user_id }, { refreshToken });
  }

  async findOneByUserIdAndDevice(user_id: string, deviceId: string) {
    return await this.repository.findOne({ where: { user_id, deviceId } });
  }

  // async saveRefreshToken(session: ISession) {
  //   const { deviceId, ...backSession } = session;
  //   try {
  //     const sessionDb = await this.repository.findOne({
  //       where: {
  //         deviceId,
  //       },
  //     });
  //     if (sessionDb) {
  //       return await this.repository.update({ deviceId }, { ...backSession });
  //     }
  //     return await this.repository.save(session);
  //   } catch {
  //     throw new InternalServerErrorException('Lỗi khi lưu phiên đăng nhập');
  //   }
  // }

  generateToken(user_id: string, deviceId: string) {
    const payload = {
      id: user_id,
      sub: deviceId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    return { accessToken, refreshToken };
  }

  async handleLogin(user_id: string, metaData: LoginMetaData) {
    const { deviceId, ipAddress } = metaData;

    const currentDevice = await this.repository.findOne({
      where: { deviceId },
    });

    const { accessToken, refreshToken } = this.generateToken(user_id, deviceId);

    const expiredAt = addDay(
      this.configService.get<number>('JWT_REFRESH_EXPIRE_DAY'),
    );

    const newDeviceSession = new DeviceSession();
    newDeviceSession.user_id = user_id;
    newDeviceSession.deviceId = deviceId;
    newDeviceSession.ipAddress = ipAddress;
    newDeviceSession.refreshToken = refreshToken;
    newDeviceSession.expiredAt = expiredAt;
    newDeviceSession.createdAt = new Date();

    // update or create device session
    await this.repository.save({
      id: currentDevice?.id,
      ...newDeviceSession,
    });
    return { accessToken, refreshToken, expiredAt };
  }
}
