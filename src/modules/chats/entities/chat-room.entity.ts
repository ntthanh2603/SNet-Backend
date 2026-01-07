import { ChatMember } from 'src/modules/chats/entities/chat-member.entity';
import { WaitingMembers } from 'src/modules/chats/entities/waiting-members.entity';
import { ChatMessage } from 'src/modules/chats/entities/chat-message.entity';
import { MemberType } from 'src/helper/member.enum';
import { ReactionType } from 'src/helper/reaction.enum';
import { PinChat } from 'src/pin-chats/entities/pin-chat.entity';
import { PinMessage } from 'src/pin-messages/entities/pin-messages.entity';
import { User } from 'src/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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
  @Index()
  name: string;

  @Index()
  @Column({ default: 'chat-room.png' })
  avatar: string;

  @Column()
  created_by: string;

  @Column({ type: 'enum', enum: MemberType, default: MemberType.MEMBER })
  permission_add_member: MemberType;

  @CreateDateColumn()
  created_at: Date;

  @Index()
  @Column({ type: 'enum', enum: ReactionType, default: ReactionType.LIKE })
  reaction_default: ReactionType;

  @Column({ default: false })
  end_to_end_encryption: boolean;

  @ManyToOne(() => User, (user) => user.chat_rooms)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @OneToMany(() => ChatMember, (chatMember) => chatMember.chat_room)
  chat_members: ChatMember[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat_room)
  chat_messages: ChatMessage[];

  @OneToMany(() => PinMessage, (pinMessage) => pinMessage.chat_room)
  pin_messages: PinMessage[];

  @OneToMany(() => PinChat, (pinChat) => pinChat.chat_room)
  pin_chats: PinChat[];

  @OneToMany(() => WaitingMembers, (waitingMembers) => waitingMembers.chat_room)
  waiting_members: WaitingMembers[];
}
