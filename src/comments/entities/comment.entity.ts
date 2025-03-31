import { ParentChildComment } from 'src/parent-child-comments/entities/parent-child-comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  post_id: string;

  @Column()
  content: string;

  @Column('text', { array: true, default: null })
  medias: string[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(
    () => ParentChildComment,
    (parentChildComment) => parentChildComment.parentComment,
  )
  childComments: ParentChildComment[];

  @OneToMany(
    () => ParentChildComment,
    (parentChildComment) => parentChildComment.childComment,
  )
  parentComments: ParentChildComment[];
}
