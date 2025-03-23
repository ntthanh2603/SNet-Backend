import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { IAdmin } from 'src/admins/admin.interface';
import { CreateNotiSystemDto } from './dto/create-noti-system.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationType } from 'src/helper/notification.enum';
import { LoggerService } from 'src/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectQueue('noti-system') private notiQueue: Queue,
    private logger: LoggerService,
  ) {}

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
      { notification_id: notification.id },
      { removeOnComplete: true },
    );
    // Log
    this.logger.log({
      message: 'Create notification system',
      metadata: {
        ...notification,
        adminId: admin.id,
      },
    });
    return;
  }
}
