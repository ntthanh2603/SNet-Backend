import {
  forwardRef,
  Inject,
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
import addDay from 'src/helper/addDay';
import { randomUUID } from 'crypto';
import * as randomatic from 'randomatic';
import { RoleType } from 'src/helper/role.enum';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

export interface ISession {
  userId: string;
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
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getSecret(userId: string, deviceSecssionId: string) {
    const deviceSeccion = await this.repository.findOne({
      where: { device_id: deviceSecssionId, user: { id: userId } },
    });
    return deviceSeccion?.secret_key;
  }

  async logout(user: IUser, device_id: string) {
    const userDb = await this.usersService.findUserById(user.id);

    const result = await this.repository.update(
      {
        user: userDb,
        device_id,
      },
      { refresh_token: null },
    );
    if (result['affected'] != 0) return { message: 'Đăng xuất thành công' };
    else throw new InternalServerErrorException('Lỗi khi đăng xuất tài khoản');
  }

  async findOne(deviceSecssionId: string) {
    return await this.repository.findOne({ where: { id: deviceSecssionId } });
  }

  async reAuth(_refresh_token: string, device_id: string) {
    const session = await this.repository.findOne({
      where: { device_id, refresh_token: _refresh_token },
    });

    if (
      !session ||
      new Date(session.expired_at).valueOf() < new Date().valueOf()
    ) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const secretKey = randomatic('A0', 16);

    const user = await this.usersService.findUserById(session.user.id);

    const payload = {
      id: user.id,
      deviceSecssionId: session.id,
      role: user.role,
    };

    const [accessToken, refresh_token, expired_at] = [
      this.authService.generateAccessToken(payload, secretKey),
      randomatic('Aa0', 64),
      addDay(this.configService.get<number>('JWT_REFRESH_EXPIRE_DAY')),
    ];

    await this.repository.update(session.id, {
      refresh_token,
      expired_at,
      secret_key: secretKey,
    });
    return { accessToken, expired_at };
  }

  async handleLogin(userId: string, metaData: LoginMetaData, role: RoleType) {
    const { deviceId, ipAddress } = metaData;

    const currentDevice = await this.repository.findOne({
      where: {
        device_id: deviceId,
      },
    });

    const deviceSecssionId = currentDevice?.id || randomUUID();

    const payload = {
      id: userId,
      deviceSecssionId: deviceSecssionId,
      role: role,
    };

    const user = await this.usersService.findUserById(userId);

    const secretKey = randomatic('A0', 16);

    const [accessToken, refreshToken, expiredAt] = [
      this.authService.generateAccessToken(payload, secretKey),
      randomatic('Aa0', 64),
      addDay(this.configService.get<number>('JWT_REFRESH_EXPIRE_DAY')),
    ];

    const newDeviceSession = new DeviceSession();
    newDeviceSession.id = deviceSecssionId;
    newDeviceSession.user = user;
    newDeviceSession.device_id = deviceId;
    newDeviceSession.ip_address = ipAddress;
    newDeviceSession.refresh_token = refreshToken;
    newDeviceSession.secret_key = secretKey;
    newDeviceSession.expired_at = expiredAt;
    newDeviceSession.created_at = new Date();

    // update or create device session
    await this.repository.save({
      ...newDeviceSession,
    });
    return { accessToken, refreshToken, expiredAt };
  }
}
