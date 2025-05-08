import { ChatMessage } from 'src/chat-messages/entities/chat-message.entity';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import {
  Column,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class PinMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  chat_room_id: string;

  @Index()
  @Column()
  chat_message_id: string;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.pin_messages)
  @JoinColumn({ name: 'chat_message_id' })
  chat_message: ChatMessage[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.pin_messages)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRoom[];
}
