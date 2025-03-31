import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationUser } from './entities/notification-user.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';
import { DeleteNotificationUserDto } from './dto/delete-noti-user.dto';

@Injectable()
export class NotificationUsersService {
  constructor(
    @InjectRepository(NotificationUser)
    private readonly notiUserRepository: Repository<NotificationUser>,
  ) {}

  async readNoti(user_id: string, noti_user_id: string) {
    await this.notiUserRepository.update(
      { id: noti_user_id, user_id: user_id },
      { is_read: true },
    );
  }

  async deleteNoti(user: IUser, dto: DeleteNotificationUserDto) {
    const result = await this.notiUserRepository.delete({
      id: dto.noti_user_id,
      user_id: user.id,
    });

    if (result.affected === 0) {
      throw new BadRequestException('Notification not found');
    }
  }

  async deleteAllNoti(user: IUser) {
    const result = await this.notiUserRepository.delete({
      user_id: user.id,
    });

    if (result.affected === 0) {
      throw new BadRequestException('Notification not found');
    }
  }
}
