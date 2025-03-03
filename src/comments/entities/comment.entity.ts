import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @Index()
  @PrimaryColumn()
  user_id: string;

  @Index()
  @PrimaryColumn()
  post_id: string;

  @Column()
  content: string;

  @Column('text', { array: true, default: null })
  medias: string[];

  @CreateDateColumn()
  created_at: Date;
}
