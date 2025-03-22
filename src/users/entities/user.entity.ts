import { MaxLength, MinLength } from 'class-validator';
import { DeviceSession } from 'src/device-sessions/entities/device-session.entity';
import { GenderType } from 'src/helper/gender.enum';
import { PrivacyType } from 'src/helper/privacy.enum';
import { RoleType } from 'src/helper/role.enum';
import { UserCategoryType } from 'src/helper/user-category.enum';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';
import { Relation } from 'src/relations/entities/relation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @Column({ default: null })
  avatar: string;

  @Column()
  username: string;

  @Column({ default: null })
  bio: string;

  @Column({ default: null })
  website: string;

  @Column({ default: null })
  birthday: Date;

  @Column({ type: 'enum', enum: GenderType, default: null })
  gender: GenderType;

  @Column({ default: null })
  address: string;

  @Column({ type: 'enum', enum: PrivacyType, default: PrivacyType.PUBLIC })
  privacy: PrivacyType;

  @Column({ default: null })
  last_active: Date;

  @Column({
    type: 'enum',
    enum: UserCategoryType,
    default: UserCategoryType.CASUALUSER,
  })
  user_category: UserCategoryType;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  company: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  education: string[];

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at: Date;

  @OneToMany(() => DeviceSession, (deviceSession) => deviceSession.user)
  deviceSession: DeviceSession[];

  @OneToMany(() => Relation, (relation) => relation.request_side)
  request_side: Relation[];

  @OneToMany(() => Relation, (relation) => relation.accept_side)
  accept_side: Relation[];

  @OneToMany(
    () => NotificationUser,
    (notification_user) => notification_user.id,
  )
  notification_user: NotificationUser[];
}
