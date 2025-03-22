import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  notification_id: string;

  @ManyToOne(() => User, (user) => user.id)
  user_id: string;

  @Column({ default: false })
  is_sent: boolean;

  @Column({ default: false })
  is_read: boolean;
}
