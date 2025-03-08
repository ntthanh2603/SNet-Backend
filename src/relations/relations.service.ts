import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/users.interface';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { Relation } from './entities/relation.entity';
import { RelationDto } from './dto/relation.dto';
@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(Relation)
    private relationShipRepository: Repository<Relation>,
    private redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async getRelation(user: IUser, user_id: string) {}

  async getFriends(id: string, page: number, limit: number) {}

  async getFollower(id: string, page: number, limit: number) {}

  async getFollowed(id: string, page: number, limit: number) {}

  async follow(user: IUser, dto: RelationDto) {}

  async unfollow(user: IUser, dto: RelationDto) {}

  async acceptFriend(user: IUser, dto: RelationDto) {}

  async unFriend(user: IUser, dto: RelationDto) {}
}
