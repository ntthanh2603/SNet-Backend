import { ReactionType } from 'src/helper/reaction.enum';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  user_id: string;

  @Index()
  @Column({ nullable: true })
  post_id: string;

  @Index()
  @Column({ nullable: true })
  comment_id: string;

  @Column({ enum: ReactionType, default: ReactionType.LIKE })
  reaction: ReactionType;

  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
