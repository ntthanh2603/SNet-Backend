import { RelationType } from 'src/helper/relation.enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Relation {
  @PrimaryColumn('uuid')
  request_side: string;

  @PrimaryColumn('uuid')
  accept_side: string;

  @Column({ default: RelationType.FOLLOW })
  relation: RelationType;

  @CreateDateColumn()
  created_at: Date;
}
