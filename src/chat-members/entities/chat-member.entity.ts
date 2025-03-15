import { RoleType } from 'src/helper/role.enum';
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
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;
}
