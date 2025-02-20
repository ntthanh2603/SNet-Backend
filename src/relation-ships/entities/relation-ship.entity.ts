import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RelationShip {
  @PrimaryColumn('uuid')
  userId1: string;

  @PrimaryColumn('uuid')
  userId2: string;
}
