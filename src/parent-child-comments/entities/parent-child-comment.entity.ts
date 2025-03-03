import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class ParentChildComment {
  @Index()
  @PrimaryColumn()
  parent_comment: string;

  @Index()
  @PrimaryColumn()
  child_comment: string;
}
