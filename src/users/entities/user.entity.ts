import { MaxLength, MinLength } from 'class-validator';
import {
  GenderType,
  PrivacyType,
  UserCategoryType,
} from 'src/helper/helper.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at: Date;
}
