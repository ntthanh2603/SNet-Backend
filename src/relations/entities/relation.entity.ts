import { RelationType } from 'src/helper/relation.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Relation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.request_side, { onDelete: 'CASCADE' })
  request_side: User;

  @ManyToOne(() => User, (user) => user.accept_side, {
    onDelete: 'CASCADE',
  })
  accept_side: User;

  @Column({ type: 'enum', enum: RelationType })
  relation: RelationType; // Relation Type (Friend, Blocked, Following)

  @CreateDateColumn()
  created_at: Date;
}
