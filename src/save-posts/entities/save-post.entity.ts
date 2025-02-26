import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SavePost {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  postId: string;

  @Column()
  key: string;
}
