import { StatusType } from 'src/helper/helper.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  user_id: string;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  ipAddress: string;

  @Column()
  lastActive: Date;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.OFF })
  isActive: StatusType;

  @Column()
  refreshToken: string;
}
