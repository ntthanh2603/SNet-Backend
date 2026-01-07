import { ChatRoom } from 'src/modules/chats/entities/chat-room.entity';
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
export class WaitingMembers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  chat_room_id: string;

  @Index()
  @Column()
  user_id: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.waiting_members)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom;

  @ManyToOne(() => User, (user) => user.waiting_members)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
