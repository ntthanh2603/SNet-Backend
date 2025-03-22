import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotiBirthdayProcessor } from 'src/bullmq/notification-birthday.processor';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly notiBirthdayProcessor: NotiBirthdayProcessor,
  ) {}

  createByAdmin(dto: CreateNotificationDto) {
    console.log(dto);
  }
}
