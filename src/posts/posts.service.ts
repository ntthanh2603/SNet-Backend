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
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
    private readonly redisService: RedisService,
    @InjectQueue('create-posts')
    private mediasPostsQueue: Queue,
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
   * Create a new post with the given content, medias and privacy.
   *
   * @param user The user who creates the post
   * @param dto The create post dto
   * @param file The uploaded medias
   *
   * @throws BadRequestException If the content and medias are empty
   * @throws InternalServerErrorException If there is an error when creating the post
   *
   * @returns A message indicating that the post has been created successfully
   */
  async create(user: IUser, dto: CreatePostDto, file: Express.Multer.File[]) {
    // Check if content and medias are empty
    if (!dto.content && !file)
      throw new BadRequestException('Content and medias are required');

    // Map path of file to string
    const medias: string[] = file.map((f) => (f ? f.filename : ''));

    try {
      // Create a new post
      const newPost = new Post();
      newPost.id = uuidv4();
      newPost.user_id = user.id;
      newPost.content = dto?.content;
      newPost.medias = medias;
      newPost.privacy = dto.privacy;
      newPost.created_at = new Date();

      await this.repository.save(newPost);

      // Log post in elasticsearch
      this.loggerServer.log(
        {
          message: 'Create post successfully',
          userId: user.id,
          method: 'POST',
          role: user.role,
          deviceId: user.deviceSecssionId,
          metadata: {
            id: newPost.id,
            content: dto.content,
            medias: medias,
            privacy: dto.privacy,
          },
        },
        'snet-system-logs-posts',
      );

      // Add job to queue
      this.mediasPostsQueue.add(
        'create-posts',
        {
          ...newPost,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
      return {
        message: 'Create post successfully',
      };
    } catch (err) {
      // Log error in elasticsearch
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
            medias: medias,
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

  findOne(user: IUser, id: string) {
    return `This action returns a #${id} post`;
  }

  async update(user: IUser, dto: UpdatePostDto) {
    await this.findPostByID(dto.id);
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
