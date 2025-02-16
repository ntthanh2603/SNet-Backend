import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'rxjs';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private userNotifications: Map<string, Subject<string>> = new Map();
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}
}
