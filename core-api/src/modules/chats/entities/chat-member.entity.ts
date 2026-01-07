import { ChatRoom } from 'src/modules/chats/entities/chat-room.entity';
import { MemberType } from 'src/helper/member.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  chat_room_id: string;

  @Index()
  @Column()
  user_id: string;

  @Index()
  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.MEMBER,
  })
  member_type: MemberType;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: true })
  allow_notification: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.chat_members)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chat_members)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom;
}
