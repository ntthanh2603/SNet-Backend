import { Notification } from 'src/notifications/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Notification, (notification) => notification.id)
  notification_id: string;

  @ManyToOne(() => User, (user) => user.id)
  user_id: string;

  @Column({ default: false })
  is_sent: boolean;

  @Column({ default: false })
  is_read: boolean;
}
