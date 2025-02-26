import { ReactionType } from 'src/helper/helper.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReactionPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ enum: ReactionType, default: ReactionType.LIKE })
  reactionType: ReactionType;

  @CreateDateColumn()
  createdAt: Date;
}
