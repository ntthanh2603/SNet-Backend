import { NotificationType } from 'src/helper/notification.enum';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ default: null })
  title: string;

  @Index()
  @Column({ default: null })
  message: string;

  @Column({ type: 'enum', enum: NotificationType })
  notification_type: NotificationType;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(
    () => NotificationUser,
    (notificationUser) => notificationUser.notification,
  )
  notification_user: NotificationUser[];
}
