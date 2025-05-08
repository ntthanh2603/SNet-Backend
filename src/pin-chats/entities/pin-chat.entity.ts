import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class PinChats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  chat_room_id: string;

  @Index()
  @Column()
  user_id: string;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.pin_chats)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: PinChats[];

  @OneToMany(() => User, (user) => user.pin_chats)
  @JoinColumn({ name: 'user_id' })
  user: PinChats[];
}
