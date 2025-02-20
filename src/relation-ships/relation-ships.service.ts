import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RelationShip } from './entities/relation-ship.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationShipDto } from './dto/relation-ship.dto';
import { IUser } from 'src/users/users.interface';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RelationShipsService {
  constructor(
    @InjectRepository(RelationShip)
    private relationShipRepository: Repository<RelationShip>,
    private redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async listFollower(id: string) {
    try {
      const user = await this.usersService.findUserById(id);
      if (!user)
        throw new NotFoundException(`Người dùng có id là ${id} không tồn tại`);

      const list_follower_cache = await this.redisService.get(
        `list_follower:${id}`,
      );
      if (list_follower_cache) {
        return list_follower_cache;
      }

      const temp = await this.relationShipRepository.find({
        where: { userId2: id },
      });

      const list_follower_db = temp.map((relation) => relation.userId1);

      await this.redisService.set(`list_follower:${id}`, list_follower_db, 600);
      return list_follower_db;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Lỗi khi lấy danh sách người dùng theo dõi người dùng có id là ${id}`,
      );
    }
  }

  async listFollowed(id: string) {
    try {
      const user = await this.usersService.findUserById(id);
      if (!user)
        throw new NotFoundException(`Người dùng có id là ${id} không tồn tại`);

      const list_followed_cache = await this.redisService.get(
        `list_followed:${id}`,
      );
      if (list_followed_cache) {
        return { cache: list_followed_cache };
      }

      const temp = await this.relationShipRepository.find({
        where: { userId1: id },
      });

      const list_followed_db = temp.map((relation) => relation.userId2);

      await this.redisService.set(`list_followed:${id}`, list_followed_db, 600);
      return list_followed_db;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Lỗi khi lấy danh sách người dùng mà người dùng có id là ${id} theo dõi`,
      );
    }
  }
  async follow(user: IUser, dto: RelationShipDto) {
    try {
      const userId1: string = user.id;
      const userId2: string = dto.user_id_other;

      const user_other = await this.usersService.findUserById(userId2);
      if (!user_other)
        throw new NotFoundException(
          `Người dùng có id là ${userId2} không tồn tại`,
        );

      const relation = await this.relationShipRepository.findOne({
        where: { userId1, userId2 },
      });
      if (relation)
        throw new BadRequestException(
          `Người dùng có id là ${userId1} đã follow người dùng có id là ${userId2}`,
        );

      const newRelationShip = {
        userId1: userId1,
        userId2: userId2,
      };
      await this.relationShipRepository.save(newRelationShip);

      await this.redisService.del(`list_followed:${userId1}`);
      await this.redisService.del(`list_follower:${userId2}`);

      return 'Theo dõi thành công';
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Lỗi khi theo dõi');
    }
  }

  async unfollow(user: IUser, dto: RelationShipDto) {
    try {
      const userId1: string = user.id;
      const userId2: string = dto.user_id_other;

      const user_other = await this.usersService.findUserById(userId2);
      if (!user_other)
        throw new NotFoundException(
          `Người dùng có id là ${userId2} không tồn tại`,
        );

      const relation = await this.relationShipRepository.findOne({
        where: { userId1, userId2 },
      });
      if (!relation)
        throw new BadRequestException(
          `Người dùng có id là ${userId1} chưa follow người dùng có id là ${userId2}`,
        );

      await this.relationShipRepository.delete({ userId1, userId2 });

      await this.redisService.del(`list_followed:${userId1}`);
      await this.redisService.del(`list_follower:${userId2}`);

      return 'Hủy theo dõi thành công';
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Lỗi khi hủy theo dõi');
    }
  }
}
