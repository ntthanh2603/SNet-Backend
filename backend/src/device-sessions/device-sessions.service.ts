import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { DeviceSession } from './entities/device-session.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';

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

  async save(session: object) {
    console.log(session);
    const { deviceId, ...a } = session;

    try {
      const sessionDb = await this.repository.findOne({
        where: {
          deviceId,
        },
      });
      if (sessionDb) throw new 
    } catch (error) {}

    return await this.repository.save(session);
  }
}
