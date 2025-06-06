import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { IAdmin } from 'src/admins/admin.interface';
import { CreateNotiSystemDto } from './dto/create-noti-system.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationType } from 'src/helper/notification.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectQueue('noti-system') private notiQueue: Queue,
  ) {}

  /**
   * Creates a system notification and queues it for distribution to all users.
   *
   * This function generates a new notification entry with the details provided
   * in the `CreateNotiSystemDto`, assigns it a unique ID, and categorizes it
   * as a system notification. The notification is saved to the database, and
   * a job is added to the notification queue to broadcast the notification to
   * all users. Logs the creation of the notification with the admin's ID for
   * auditing purposes.
   *
   * @param admin - The admin initiating the creation of the notification.
   * @param dto - Data transfer object containing the title and message of the notification.
   */
  async createNotiSystem(admin: IAdmin, dto: CreateNotiSystemDto) {
    // Create notification system
    const notification = new Notification();
    notification.id = uuidv4();
    notification.title = dto.title;
    notification.message = dto.message;
    notification.notification_type = NotificationType.SYSTEM;

    await this.notificationRepo.save(notification);

    // Notification for all user
    this.notiQueue.add(
      'system',
      {
        notification_id: notification.id,
        title: dto.title,
        message: dto.message,
      },
      { removeOnComplete: true },
    );
    // Log

    return;
  }
}
