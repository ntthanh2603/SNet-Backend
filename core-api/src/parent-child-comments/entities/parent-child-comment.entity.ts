import { Comment } from 'src/comments/entities/comment.entity';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class ParentChildComment {
  @Index()
  @PrimaryColumn()
  parent_comment: string;

  @Index()
  @PrimaryColumn()
  child_comment: string;

  @ManyToOne(() => Comment, (comment) => comment.childComments)
  @JoinColumn({ name: 'parent_comment' })
  parentComment: Comment;

  @ManyToOne(() => Comment, (comment) => comment.parentComments)
  @JoinColumn({ name: 'child_comment' })
  childComment: Comment;
}
