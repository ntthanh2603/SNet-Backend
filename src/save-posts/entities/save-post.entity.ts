import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class SavePost {
  @PrimaryColumn()
  @Index()
  save_list_id: string;

  @PrimaryColumn()
  @Index()
  post_id: string;
}
