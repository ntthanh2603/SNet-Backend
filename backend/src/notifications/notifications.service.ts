import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from 'src/helper/helper.enum';
import { Subject } from 'rxjs';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private notifications$ = new Subject<Notification>();

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  // Thêm thông báo
  async createNotification(
    userId: string,
    title: string,
    message: string,
    notificationType: NotificationType,
  ) {
    const notification = this.notificationRepo.create({
      userId,
      title,
      message,
      notificationType,
    });
    await this.notificationRepo.save(notification);
    this.notifications$.next(notification); // Gửi sự kiện SSE
    return notification;
  }

  // Lấy thông báo stream
  getNotificationsStream() {
    return this.notifications$.asObservable();
  }

  // Đánh dấu là đã đọc
  async markAsRead(id: string) {
    await this.notificationRepo.update(id, { isRead: true });
  }

  // Lấy thông báo với userId
  async getUserNotifications(userId: string) {
    return await this.notificationRepo.find({ where: { userId } });
  }
}
