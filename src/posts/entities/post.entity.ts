import { PrivacyType } from 'src/helper/privacy.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ default: null })
  content: string;

  @Column('text', { array: true, default: null })
  medias: string[];

  @Column('text', { array: true, default: null })
  hashtags: string[];

  @Column({ default: PrivacyType.PUBLIC, enum: PrivacyType })
  privacy: PrivacyType;

  @Column()
  created_at: Date;
}
