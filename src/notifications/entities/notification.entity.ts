import { NotificationType } from 'src/helper/notification.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}
