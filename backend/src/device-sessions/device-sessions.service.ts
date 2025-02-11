import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceSession } from './entities/device-session.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';
import { LoginMetaData } from 'src/users/users.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import addDay from 'src/helper/addDay';
import { randomUUID } from 'crypto';
import * as randomatic from 'randomatic';

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

  async logout(user: IUser, deviceId: string) {
    const result = await this.repository.delete({ user_id: user.id, deviceId });
    if (result['affected'] != 0) return { message: 'Đăng xuất thành công' };
    else throw new InternalServerErrorException('Lỗi khi đăng xuất tài khoản');
  }

  async updateToken(user_id: string, refreshToken: string) {
    return await this.repository.update({ user_id }, { refreshToken });
  }

  async findOneByUserIdAndDevice(user_id: string, deviceId: string) {
    return await this.repository.findOne({ where: { user_id, deviceId } });
  }

  generateToken(user_id: string, deviceId: string) {
    const payload = {
      id: user_id,
      sub: deviceId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    return accessToken;
  }

  async reAuth(_refreshToken: string, deviceId: string) {
    const session = await this.repository.findOne({
      where: { deviceId, refreshToken: _refreshToken },
    });

    if (
      !session ||
      new Date(session.expiredAt).valueOf() < new Date().valueOf()
    ) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const secretKey = randomatic('A0', 16);

    const [accessToken, refreshToken, expiredAt] = [
      this.generateToken(session.user_id, deviceId),
      randomatic('Aa0', 64),
      addDay(this.configService.get<number>('JWT_REFRESH_EXPIRE_DAY')),
    ];

    await this.repository.update(session.id, {
      refreshToken,
      expiredAt,
      secretKey,
    });
    return { accessToken, refreshToken, expiredAt };
  }

  async handleLogin(user_id: string, metaData: LoginMetaData) {
    const { deviceId, ipAddress } = metaData;

    const currentDevice = await this.repository.findOne({
      where: { deviceId },
    });

    const secretKey = randomatic('A0', 16);

    const [accessToken, refreshToken, expiredAt] = [
      this.generateToken(user_id, deviceId),
      randomatic('Aa0', 64),
      addDay(this.configService.get<number>('JWT_REFRESH_EXPIRE_DAY')),
    ];

    const newDeviceSession = new DeviceSession();
    newDeviceSession.user_id = user_id;
    newDeviceSession.deviceId = deviceId;
    newDeviceSession.ipAddress = ipAddress;
    newDeviceSession.refreshToken = refreshToken;
    newDeviceSession.secretKey = secretKey;
    newDeviceSession.expiredAt = expiredAt;
    newDeviceSession.createdAt = new Date();

    // update or create device session
    await this.repository.save({
      id: currentDevice?.id || randomUUID(),
      ...newDeviceSession,
    });
    return { accessToken, refreshToken, expiredAt };
  }
}
