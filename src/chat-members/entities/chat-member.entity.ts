import { MemberType } from 'src/helper/helper.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.MEMBER,
  })
  memberType: MemberType;
}
