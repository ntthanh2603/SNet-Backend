import { MaxLength, MinLength } from 'class-validator';
import { ChatMember } from 'src/modules/chats/members/entities/chat-member.entity';
import { WaitingMembers } from 'src/modules/chats/members/entities/waiting-members.entity';
import { ChatMessage } from 'src/modules/chats/messages/entities/chat-message.entity';
import { ChatRoom } from 'src/modules/chats/rooms/entities/chat-room.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { DeviceSession } from 'src/device-sessions/entities/device-session.entity';
import { GenderType } from 'src/helper/gender.enum';
import { PrivacyType } from 'src/helper/privacy.enum';
import { RoleType } from 'src/helper/role.enum';
import { UserCategoryType } from 'src/helper/user-category.enum';
import { NotificationUser } from 'src/notification-users/entities/notification-user.entity';
import { PinChat } from 'src/pin-chats/entities/pin-chat.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Relation } from 'src/relations/entities/relation.entity';
import { SaveList } from 'src/save-lists/entities/save-list.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Column()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @Index()
  @Column({ nullable: true })
  avatar: string;

  @Index()
  @Column()
  username: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ type: 'enum', enum: GenderType, nullable: true })
  gender: GenderType;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'enum', enum: PrivacyType, default: PrivacyType.PUBLIC })
  privacy: PrivacyType;

  @Column({ nullable: true })
  last_active: Date;

  @Column({
    type: 'enum',
    enum: UserCategoryType,
    default: UserCategoryType.CASUALUSER,
  })
  user_category: UserCategoryType;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  company: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  education: string[];

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @OneToMany(() => DeviceSession, (deviceSession) => deviceSession.user)
  device_sessions: DeviceSession[];

  @OneToMany(() => Relation, (relation) => relation.request_side)
  sent_relations: Relation[];

  @OneToMany(() => Relation, (relation) => relation.accept_side)
  received_relations: Relation[];

  @OneToMany(
    () => NotificationUser,
    (notification_user) => notification_user.user,
  )
  notification_users: NotificationUser[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user)
  chat_rooms: ChatRoom[];

  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chat_members: ChatMember[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chat_messages: ChatMessage[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => SaveList, (saveList) => saveList.user)
  save_lists: SaveList[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => PinChat, (pinChat) => pinChat.user)
  pin_chats: PinChat[];

  @OneToMany(() => WaitingMembers, (waitingMembers) => waitingMembers.user)
  waiting_members: WaitingMembers[];
}
