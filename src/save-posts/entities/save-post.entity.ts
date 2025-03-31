import { Post } from 'src/posts/entities/post.entity';
import { SaveList } from 'src/save-lists/entities/save-list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SavePost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  save_list_id: string;

  @Column()
  post_id: string;

  @ManyToOne(() => SaveList, (saveList) => saveList.save_posts)
  @JoinColumn({ name: 'save_list_id' })
  save_list: SaveList;

  @OneToOne(() => Post, (post) => post.save_posts)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
