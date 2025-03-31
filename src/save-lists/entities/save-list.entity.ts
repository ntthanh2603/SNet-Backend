import { SavePost } from 'src/save-posts/entities/save-post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SaveList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.save_lists)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SavePost, (savePost) => savePost.save_list)
  save_posts: SavePost[];
}
