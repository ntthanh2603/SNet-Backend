import { IsNotEmpty, IsUUID } from 'class-validator';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RelationShip {
  @PrimaryColumn()
  @IsUUID()
  @IsNotEmpty()
  user_id1: string;

  @PrimaryColumn()
  @IsUUID()
  @IsNotEmpty()
  user_id2: string;
}
