import { RelationType } from './../helper/relation.enum';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/users.interface';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { Relation } from './entities/relation.entity';
import { UpdateRelationDto } from './dto/update-relation.dto';

@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(Relation)
    private relationRepository: Repository<Relation>,
    private redisService: RedisService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getListRelation(
    userId: string,
    page: number,
    limit: number,
    relationType: RelationType,
  ) {
    const offset = (page - 1) * limit;

    // Kiểm tra user có tồn tại không
    const exists = await this.relationRepository.count({
      where: [{ request_side_id: userId }, { accept_side_id: userId }],
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    // Truy vấn danh sách quan hệ
    const relations = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.request_side', 'requestUser')
      .leftJoinAndSelect('relation.accept_side', 'acceptUser')
      .where(
        'relation.request_side_id = :userId OR relation.accept_side_id = :userId',
        { userId },
      )
      .andWhere('relation.relation_type = :relationType', { relationType })
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      page,
      limit,
      total: relations.length,
      data: relations.map((relation) => ({
        id: relation.id,
        relation_type: relation.relation_type,
        user:
          relation.request_side_id === userId
            ? relation.accept_side
            : relation.request_side,
      })),
    };
  }

  async getRelation(id: string, id_other: string): Promise<RelationType> {
    const acceptUser = await this.usersService.findUserById(id_other);
    if (!acceptUser) {
      throw new NotFoundException('User does not exist');
    }

    const relation = await this.relationRepository.findOne({
      where: {
        request_side_id: id,
        accept_side_id: id_other,
      },
    });
    return relation?.relation_type || RelationType.NONE;
  }

  async updateRelation(user: IUser, dto: UpdateRelationDto) {
    const acceptUser = await this.usersService.findUserById(dto.user_id);
    if (!acceptUser) {
      throw new NotFoundException('User does not exist');
    }

    // Relation requestUser -> acceptUser
    const relationRequestAccept = await this.relationRepository.findOne({
      where: {
        request_side_id: user.id,
        accept_side_id: dto.user_id,
      },
    });

    // Relation acceptUser -> requestUser
    const relationAcceptRequest = await this.relationRepository.findOne({
      where: {
        request_side_id: dto.user_id,
        accept_side_id: user.id,
      },
    });

    const relationNew = dto.relation;

    // Update relation requestUser -> acceptUser
    switch (true) {
      // RequestUser -> acceptUser relation friend
      case relationNew === RelationType.FRIEND &&
        relationAcceptRequest?.relation_type === RelationType.FOLLOWING &&
        !relationRequestAccept:
        // Update relation acceptUser -> requestUser
        await this.relationRepository.save({
          request_side_id: dto.user_id,
          accept_side_id: user.id,
          relation: RelationType.FRIEND,
        });

        // Create relation requestUser -> acceptUser
        await this.relationRepository.save({
          request_side_id: user.id,
          accept_side_id: dto.user_id,
          relation: RelationType.FRIEND,
        });
        break;

      // RequestUser -> acceptUser relation following
      case relationNew === RelationType.FOLLOWING &&
        !relationRequestAccept &&
        !relationAcceptRequest:
        await this.relationRepository.save({
          request_side_id: user.id,
          accept_side_id: dto.user_id,
          relation: RelationType.FOLLOWING,
        });

        break;

      // RequestUser -> acceptUser does not exits relation
      case relationNew === RelationType.NONE &&
        (relationRequestAccept?.relation_type === RelationType.FRIEND ||
          relationRequestAccept?.relation_type === RelationType.FOLLOWING ||
          relationAcceptRequest?.relation_type === RelationType.FRIEND ||
          relationAcceptRequest?.relation_type === RelationType.FOLLOWING):
        await this.relationRepository.delete({
          request_side_id: user.id,
          accept_side_id: dto.user_id,
        });
        await this.relationRepository.delete({
          request_side_id: dto.user_id,
          accept_side_id: user.id,
        });
        break;

      // RequestUser -> acceptUser relation block
      case relationNew === RelationType.BLOCK:
        await this.relationRepository.update(
          { request_side_id: user.id, accept_side_id: dto.user_id },
          { relation_type: RelationType.BLOCK },
        );

        await this.relationRepository.delete({
          request_side_id: dto.user_id,
          accept_side_id: user.id,
        });
        break;

      // Other case
      default:
        throw new BadRequestException('Info input is incorrect');
    }

    return {
      message: `Update relation ${relationNew} successfully`,
    };
  }
}
