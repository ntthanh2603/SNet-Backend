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
  ) {}

  async findPostByID(id: string): Promise<any> {
    try {
      const postCache = await this.redisService.get(`post:${id}`);

      if (postCache) return JSON.parse(postCache as string);

      const postDb = await this.repository.findOne({
        where: { id },
        relations: ['user', 'reactions', 'comments'],
      });
      if (!postDb) throw new NotFoundException(`Post id: ${id} does not exist`);

      const postWithInteractions = {
        ...postDb,
        interactions: {
          likes:
            postDb.reactions?.filter((r) => r.reaction === 'like').length || 0,
          comments: postDb.comments?.length || 0,
          reposts: 0,
        },
      };

      await this.redisService.set(
        `post:${id}`,
        JSON.stringify(postWithInteractions),
        300,
      );

      return postWithInteractions;
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
      if (err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException('Error when create post');
    }
  }

  async findAll(page: number = 1, limit: number = 10, user_id?: string) {
    try {
      const queryOptions: any = {
        relations: ['user', 'reactions', 'comments'],
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      };

      if (user_id) {
        queryOptions.where = { user_id };
      }

      const [posts, total] = await this.repository.findAndCount(queryOptions);

      const data = posts.map((post) => ({
        ...post,
        interactions: {
          likes:
            post.reactions?.filter((r) => r.reaction === 'like').length || 0,
          comments: post.comments?.length || 0,
          reposts: 0,
        },
      }));

      return {
        data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / limit),
        },
      };
    } catch {
      throw new InternalServerErrorException('Error when fetching posts');
    }
  }

  async findOne(user: IUser, id: string) {
    return this.findPostByID(id);
  }

  async update(user: IUser, dto: UpdatePostDto) {
    const post = await this.findPostByID(dto.id);
    if (post.user_id !== user.id) {
      throw new BadRequestException(
        'You are not authorized to update this post',
      );
    }

    try {
      await this.repository.update(dto.id, {
        content: dto.content,
        privacy: dto.privacy,
      });
      await this.redisService.del(`post:${dto.id}`);
      return { message: 'Update post successfully' };
    } catch {
      throw new InternalServerErrorException('Error when updating post');
    }
  }

  async remove(id: string) {
    try {
      const post = await this.findPostByID(id);
      await this.repository.remove(post);
      await this.redisService.del(`post:${id}`);
      return { message: 'Delete post successfully' };
    } catch {
      throw new InternalServerErrorException('Error when deleting post');
    }
  }
}
