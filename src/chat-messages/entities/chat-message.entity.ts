import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { MessageStatusType } from 'src/helper/message-status.enum';
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
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  chat_room_id: string;

  @Column()
  created_by: string;

  @Column()
  @Index()
  message: string;

  @Index()
  @Column('text', { array: true, default: null })
  medias: string[];

  @Index()
  @Column({
    type: 'enum',
    enum: MessageStatusType,
    default: MessageStatusType.NORMAL,
  })
  message_status: MessageStatusType;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chat_messages)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom;

  @ManyToOne(() => User, (user) => user.chat_messages)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => PinMessage, (pinMessage) => pinMessage.chat_message)
  pin_messages: PinMessage;
}
