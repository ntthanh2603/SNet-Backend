import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationGateway {
  private notificationStream$ = new Subject<Notification>();

  sendNotification(notification: Notification) {
    this.notificationStream$.next(notification);
  }

  getStream() {
    return this.notificationStream$.asObservable();
  }
}
