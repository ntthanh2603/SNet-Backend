import { NotificationType } from 'src/helper/notification.enum';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: null })
  title: string;

  @Column({ default: null })
  message: string;

  @Column({ enum: NotificationType })
  notification_type: NotificationType;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => NotificationUser, (notificationUser) => notificationUser)
  notificationUser: NotificationUser[];
}
