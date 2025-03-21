import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  user_id: string;
}
