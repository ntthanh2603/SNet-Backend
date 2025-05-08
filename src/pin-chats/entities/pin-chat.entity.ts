import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PinChat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  chat_room_id: string;

  @Index()
  @Column()
  user_id: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.pin_chats)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom;

  @ManyToOne(() => User, (user) => user.pin_chats)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
