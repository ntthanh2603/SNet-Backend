import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  user_id: string;

  @Index()
  @Column({ unique: true })
  device_id: string;

  @Column()
  ip_address: string;

  @Column()
  secret_key: string;

  @Column({ default: null })
  refresh_token: string;

  @Column()
  expired_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  user: User;
}
