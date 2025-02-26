import { ReactionType } from 'src/helper/helper.enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ReactionComment {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  commentId: string;

  @Column({ enum: ReactionType, default: ReactionType.LIKE })
  reactionType: ReactionType;

  @CreateDateColumn()
  createdAt: Date;
}
