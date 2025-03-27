import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chat_room_id: string;

  @Column()
  created_by: string;

  @Column()
  message: string;

  @Column('text', { array: true, default: null })
  medias: string[];

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chat_messages)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom;

  @ManyToOne(() => User, (user) => user.chat_messages)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
