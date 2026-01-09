import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { IUser } from 'src/users/users.interface';
import { ReactionType } from 'src/helper/reaction.enum';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async toggle(createReactionDto: CreateReactionDto, user: IUser) {
    const { postId, commentId } = createReactionDto;

    if (!postId && !commentId) {
      throw new Error('Either postId or commentId must be provided');
    }

    const query: any = { user_id: user.id };
    if (postId) query.post_id = postId;
    if (commentId) query.comment_id = commentId;

    const existingReaction = await this.reactionRepository.findOne({
      where: query,
    });

    if (existingReaction) {
      await this.reactionRepository.delete(existingReaction.id);
      return { message: 'Unliked' };
    } else {
      await this.reactionRepository.save({
        user_id: user.id,
        post_id: postId || null,
        comment_id: commentId || null,
        reaction: ReactionType.LIKE,
      });
      return { message: 'Liked' };
    }
  }
}
