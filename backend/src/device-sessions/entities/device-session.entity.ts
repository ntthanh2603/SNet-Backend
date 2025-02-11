import { StatusType } from 'src/helper/helper.enum';
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
  deviceId: string;

  @Column()
  ipAddress: string;

  @Column({ default: null })
  lastActive: Date;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.OFF })
  isActive: StatusType;

  @Column()
  refreshToken: string;

  @Column()
  expiredAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
