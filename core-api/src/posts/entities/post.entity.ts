import { Comment } from 'src/comments/entities/comment.entity';
import { PrivacyType } from 'src/helper/privacy.enum';
import { SavePost } from 'src/save-posts/entities/save-post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Reaction } from 'src/reactions/entities/reaction.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  user_id: string;

  @Index()
  @Column({ default: null })
  content: string;

  @Index()
  @Column('text', { array: true, default: null })
  medias: string[];

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

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @ApiProperty({
    example: { likes: 10, comments: 5, reposts: 2 },
    description: 'Interaction counts',
  })
  interactions: {
    likes: number;
    comments: number;
    reposts: number;
  };
}
