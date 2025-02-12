import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
    private readonly redisService: RedisService,
  ) {}
  async create(user: IUser, dto: CreatePostDto) {
    try {
      const newPost = new Post();
      newPost.user_id = user.id;
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
