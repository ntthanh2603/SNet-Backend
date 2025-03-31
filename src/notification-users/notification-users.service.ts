import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationUser } from './entities/notification-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationUsersService {
  constructor(
    @InjectRepository(NotificationUser)
    private readonly notiUserRepository: Repository<NotificationUser>,
  ) {}

  async readNotification(user_id: string, noti_user_id: string) {
    await this.notiUserRepository.update(
      { id: noti_user_id, user_id: user_id },
      { is_read: true },
    );
  }
}
