import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
    private readonly redisService: RedisService,
    private readonly loggerServer: LoggerService,
  ) {}

  async findPostByID(id: string) {
    try {
      const postCache = await this.redisService.get(`post:${id}`);

      if (postCache) return postCache;

      const postDb = await this.repository.findOne({ where: { id } });
      if (!postDb) throw new NotFoundException(`Post id: ${id} does not exist`);

      await this.redisService.set(`post:${id}`, JSON.stringify(postDb), 300);

      return postDb;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error find post with id: ${id}`);
    }
  }

  /**
   * Creates a new post and saves it to the database.
   * @param user The user who is creating the post.
   * @param dto The data transfer object containing the post information.
   * @returns A message indicating that the post was created successfully.
   * @throws BadRequestException if the content and medias are both empty.
   * @throws InternalServerErrorException if an error occurs during the creation process.
   */
  async create(user: IUser, dto: CreatePostDto) {
    try {
      if (!dto.content && !dto.medias)
        throw new BadRequestException('Content and medias are required');

      const newPost = new Post();
      newPost.user_id = user.id;
      newPost.content = dto.content;
      newPost.medias = dto.medias;
      newPost.privacy = dto.privacy;
      newPost.created_at = new Date();

      await this.repository.save(newPost);

      this.loggerServer.log(
        {
          message: 'Create post successfully',
          userId: user.id,
          method: 'POST',
          role: user.role,
          deviceId: user.deviceSecssionId,
          metadata: {
            content: dto.content,
            medias: dto.medias,
            privacy: dto.privacy,
          },
        },
        'snet-system-logs-posts',
      );

      return {
        message: 'Create post successfully',
      };
    } catch (err) {
      this.loggerServer.error(
        {
          message: 'Error when create post',
          error: err.message,
          stack: err.stack,
          userId: user.id,
          method: 'POST',
          role: user.role,
          deviceId: user.deviceSecssionId,
          metadata: {
            content: dto.content,
            medias: dto.medias,
            privacy: dto.privacy,
          },
        },
        'snet-system-logs-posts',
      );
      if (err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException('Error when create post');
    }
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  async update(user: IUser, dto: UpdatePostDto) {
    await this.findPostByID(dto.id);
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
