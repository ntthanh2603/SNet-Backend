import { ReactionType } from 'src/helper/reaction.enum';
import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Reaction {
  @Index()
  @PrimaryColumn()
  user_id: string;

  @Index()
  @PrimaryColumn()
  post_comment_id: string;

  @Column({ enum: ReactionType, default: ReactionType.LIKE })
  reaction: ReactionType;

  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn({ name: 'post_comment_id' })
  post: Post;
}
