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
    const { post_comment_id } = createReactionDto;
    const existingReaction = await this.reactionRepository.findOne({
      where: {
        user_id: user.id,
        post_comment_id,
      },
    });

    if (existingReaction) {
      await this.reactionRepository.delete({
        user_id: user.id,
        post_comment_id,
      });
      return { message: 'Unliked' };
    } else {
      await this.reactionRepository.save({
        user_id: user.id,
        post_comment_id,
        reaction: ReactionType.LIKE,
      });
      return { message: 'Liked' };
    }
  }
}
