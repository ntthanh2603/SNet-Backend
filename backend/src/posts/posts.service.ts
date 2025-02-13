import {
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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
    private readonly redisService: RedisService,
  ) {}

  async findPostByID(id: string) {
    try {
      const postCache = await this.redisService.get(`post:${id}`);

      if (postCache) return postCache;

      const postDb = await this.repository.findOne({ where: { id } });
      if (!postDb) throw new NotFoundException(`Post id: ${id} does not exist`);

      await this.redisService.set(`post:${id}`, postDb, 300);

      return postDb;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error find post with id: ${id}`);
    }
  }

  async create(user: IUser, dto: CreatePostDto) {
    try {
      const newPost = new Post();
      newPost.userId = user.id;
      newPost.content = dto.content;
      newPost.medias = dto.medias;
      newPost.privacy = dto.privacy;
      newPost.createdAt = new Date();

      return await this.repository.save(newPost);
    } catch {
      throw new InternalServerErrorException('Error when create post');
    }
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(user: IUser, dto: UpdatePostDto) {
    await this.findPostByID(dto.id);
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
