import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  @ManyToOne(() => User, (user) => user.deviceSession)
  user: User;
}
