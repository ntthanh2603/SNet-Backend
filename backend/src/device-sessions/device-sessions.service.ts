import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { DeviceSession } from './entities/device-session.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';
import { StatusType } from 'src/helper/helper.enum';

export interface ISession {
  user_id: string;
  deviceId: string;
  ipAddress: string;
  lastActive: Date;
  isActive: StatusType;
  refreshToken: string;
}
@Injectable()
export class DeviceSessionsService {
  constructor(
    @InjectRepository(DeviceSession)
    private repository: Repository<DeviceSession>,
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

  async saveRefreshToken(session: ISession) {
    const { deviceId, ...backSession } = session;
    try {
      const sessionDb = await this.repository.findOne({
        where: {
          deviceId,
        },
      });
      if (sessionDb) {
        return await this.repository.update({ deviceId }, { ...backSession });
      }
      return await this.repository.save(session);
    } catch {
      throw new InternalServerErrorException('Lỗi khi lưu phiên đăng nhập');
    }
  }
}
