import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SaveList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  name: string;
}
