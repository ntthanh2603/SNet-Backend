import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { RoleType } from 'src/helper/role.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chat_room_id: string;

  @Column()
  user_id: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.chat_members)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chat_members)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom;
}
