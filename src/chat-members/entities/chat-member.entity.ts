import { MemberType } from 'src/helper/helper.enum';
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity()
export class ChatMember {
  @Index()
  @PrimaryColumn()
  room_id: string;

  @Index()
  @PrimaryColumn()
  user_id: string;

  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.MEMBER,
  })
  member_type: MemberType;
}
