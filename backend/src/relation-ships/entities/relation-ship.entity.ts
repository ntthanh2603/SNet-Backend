import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RelationShip {
  @PrimaryColumn('uuid')
  user_id1: string;

  @PrimaryColumn('uuid')
  user_id2: string;
}
