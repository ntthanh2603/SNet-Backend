import { PrivacyType } from 'src/helper/helper.enum';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ default: null })
  content: string;

  @Column({ default: null })
  medias: string[];

  @Column({ default: 0 })
  comment_count: number;

  @Column({ default: 0 })
  reaction_count: number;

  @Column({ default: 0 })
  share_count: number;

  @Column({ default: PrivacyType.PUBLIC, enum: PrivacyType })
  privacy: PrivacyType;

  @Column()
  createdAt: Date;

  @Column({ default: null })
  updatedAt: Date;
}
