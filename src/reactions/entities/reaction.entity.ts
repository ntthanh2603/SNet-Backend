import { ReactionType } from 'src/helper/reaction.enum';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Reaction {
  @Index()
  @PrimaryColumn()
  user_id: string;

  @Index()
  @PrimaryColumn()
  post_comment_id: string;

  @Column({ enum: ReactionType, default: ReactionType.LIKE })
  reaction: ReactionType;
}
