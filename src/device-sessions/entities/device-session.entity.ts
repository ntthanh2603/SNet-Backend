import {
  Column,
  Entity,
  Index,
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
  lastActive: Date;

  @Column()
  refresh_token: string;

  @Column()
  expired_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
