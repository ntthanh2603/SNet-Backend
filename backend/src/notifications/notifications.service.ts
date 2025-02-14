import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from 'src/helper/helper.enum';
import { Observable, Subject } from 'rxjs';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private userNotifications: Map<string, Subject<string>> = new Map();
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}
  getNotifications(userId: string): Observable<string> {
    if (!this.userNotifications.has(userId)) {
      this.userNotifications.set(userId, new Subject<string>());
    }
    return this.userNotifications.get(userId).asObservable();
  }

  sendNotification(userId: string, message: string) {
    if (this.userNotifications.has(userId)) {
      this.userNotifications.get(userId).next(message);
    }
  }
  // // Thêm thông báo
  // async createNotification(
  //   userId: string,
  //   title: string,
  //   message: string,
  //   notificationType: NotificationType,
  // ) {
  //   const notification = this.notificationRepo.create({
  //     userId,
  //     title,
  //     message,
  //     notificationType,
  //   });
  //   await this.notificationRepo.save(notification);
  //   this.notifications$.next(notification); // Gửi sự kiện SSE
  //   return notification;
  // }

  // sendNotification(notification: Notification) {
  //   this.notifications$.next(notification);
  // }

  // // Lấy thông báo stream
  // getNotificationsStream() {
  //   return this.notifications$.asObservable();
  // }

  // // Đánh dấu là đã đọc
  // async markAsRead(id: string) {
  //   await this.notificationRepo.update(id, { isRead: true });
  // }

  // // Lấy thông báo với userId
  // async getUserNotifications(userId: string) {
  //   return await this.notificationRepo.find({ where: { userId } });
  // }
}
