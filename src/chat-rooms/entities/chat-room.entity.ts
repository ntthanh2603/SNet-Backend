import { ChatMember } from 'src/chat-members/entities/chat-member.entity';
import { ChatMessage } from 'src/chat-messages/entities/chat-message.entity';
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
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  created_by: string;

  @ManyToOne(() => User, (user) => user.chat_rooms)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @OneToMany(() => ChatMember, (chatMember) => chatMember.chat_room)
  chat_members: ChatMember[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat_room)
  chat_messages: ChatMessage[];
}
