import { Comment } from 'src/comments/entities/comment.entity';
import { PrivacyType } from 'src/helper/privacy.enum';
import { SavePost } from 'src/save-posts/entities/save-post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => SavePost, (savePost) => savePost.post)
  save_posts: SavePost;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
