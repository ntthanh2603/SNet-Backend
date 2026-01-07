import { Notification } from 'src/notifications/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class NotificationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  notification_id: string;

  @Index()
  @Column()
  user_id: string;

  @Index()
  @Column({ default: false })
  is_sent: boolean;

  @Index()
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
