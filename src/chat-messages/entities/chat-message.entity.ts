import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  room_id: string;

  @Column()
  user_id: string;

  @Column()
  message: string;

  @Column('text', { array: true, default: null })
  medias: string[];

  @CreateDateColumn()
  created_at: Date;
}
