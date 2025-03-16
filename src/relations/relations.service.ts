import {
  BadRequestException,
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
import { RelationType } from 'src/helper/relation.enum';
@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(Relation)
    private relationsRepository: Repository<Relation>,
    private redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async updateRelation(user: IUser, dto: UpdateRelationDto) {
    const requestUser = await this.usersService.findUserById(user.id);
    const acceptUser = await this.usersService.findUserById(dto.user_id);
    if (!requestUser || !acceptUser) {
      throw new NotFoundException('User does not exist');
    }

    // Relation requestUser -> acceptUser
    const relationRequestAccept = await this.relationsRepository.findOne({
      where: {
        request_side: { id: requestUser.id },
        accept_side: { id: acceptUser.id },
      },
    });

    // Relation acceptUser -> requestUser
    const relationAcceptRequest = await this.relationsRepository.findOne({
      where: {
        request_side: { id: acceptUser.id },
        accept_side: { id: requestUser.id },
      },
    });

    const relationNew = dto.relation;

    // Update relation requestUser -> acceptUser
    switch (true) {
      // RequestUser -> acceptUser relation friend
      case relationNew === RelationType.FRIEND &&
        relationAcceptRequest?.relation === RelationType.FOLLOWING &&
        !relationRequestAccept:
        // Update relation acceptUser -> requestUser
        await this.relationsRepository.save({
          request_side: { id: acceptUser.id },
          accept_side: { id: requestUser.id },
          relation: RelationType.FRIEND,
        });

        // Create relation requestUser -> acceptUser
        await this.relationsRepository.save({
          request_side: { id: requestUser.id },
          accept_side: { id: acceptUser.id },
          relation: RelationType.FRIEND,
        });
        break;

      // RequestUser -> acceptUser relation following
      case relationNew === RelationType.FOLLOWING &&
        !relationRequestAccept &&
        !relationAcceptRequest:
        const relationFollowing = this.relationsRepository.create({
          request_side: { id: requestUser.id },
          accept_side: { id: acceptUser.id },
          relation: RelationType.FOLLOWING,
        });

        await this.relationsRepository.save(relationFollowing);

        break;

      // RequestUser -> acceptUser does not exits relation
      case relationNew === RelationType.NONE &&
        (relationRequestAccept?.relation === RelationType.FRIEND ||
          relationRequestAccept?.relation === RelationType.FOLLOWING ||
          relationAcceptRequest?.relation === RelationType.FRIEND ||
          relationAcceptRequest?.relation === RelationType.FOLLOWING):
        await this.relationsRepository.delete({
          request_side: requestUser,
          accept_side: acceptUser,
        });
        await this.relationsRepository.delete({
          request_side: acceptUser,
          accept_side: requestUser,
        });
        break;

      // RequestUser -> acceptUser relation block
      case relationNew === RelationType.BLOCK:
        await this.relationsRepository.update(
          { request_side: requestUser, accept_side: acceptUser },
          { relation: RelationType.BLOCK },
        );

        await this.relationsRepository.delete({
          request_side: acceptUser,
          accept_side: requestUser,
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
