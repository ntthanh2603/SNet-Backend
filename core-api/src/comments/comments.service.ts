import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { IUser } from 'src/users/users.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly redisService: RedisService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: IUser) {
    const { content, post_id } = createCommentDto;
    try {
      const newComment = this.commentRepository.create({
        content,
        post_id,
        user_id: user.id,
        created_at: new Date(),
      });
      await this.commentRepository.save(newComment);

      // Invalidate cache
      await this.redisService.del(`post:${post_id}`);

      return { message: 'Comment created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error creating comment');
    }
  }
}
