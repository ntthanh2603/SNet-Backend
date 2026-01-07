import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  device_id: string;

  @Index()
  @Column()
  ip_address: string;

  @Index()
  @Column()
  secret_key: string;

  @Index()
  @Column({ default: null })
  refresh_token: string;

  @Index()
  @Column()
  expired_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Index()
  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.device_sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
