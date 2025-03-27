import { Notification } from 'src/notifications/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class NotificationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  notification_id: string;

  @Column()
  user_id: string;

  @Column({ default: false })
  is_sent: boolean;

  @Column({ default: false })
  is_read: boolean;

  @ManyToOne(
    () => Notification,
    (notification) => notification.notification_user,
  )
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  @ManyToOne(() => User, (user) => user.notification_users)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
