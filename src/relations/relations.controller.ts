import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, ResponseMessage } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { isUUID } from 'class-validator';
import { RelationDto } from './dto/relation.dto';
import { RelationsService } from './relations.service';
import { UpdateRelationDto } from './dto/update-relation.dto';

@ApiTags('Relations')
@Controller('relations')
export class RelationsController {
  constructor(private readonly relationShipsService: RelationsService) {}

  // @Public()
  // @ResponseMessage('Danh sách bạn bè')
  // @Get('friends/:id')
  // @ApiOperation({ summary: 'Danh sách bạn bè' })
  // getFriends(
  //   @Param('id') id: string,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ) {
  //   if (!isUUID(id)) {
  //     throw new BadRequestException(`Invalid ID format: ${id}`);
  //   }
  //   return this.relationShipsService.getFriends(id, page, limit);
  // }

  // @Public()
  // @ResponseMessage('Danh sách người theo dõi')
  // @Get('friends/:id')
  // @ApiOperation({ summary: 'Danh sách người theo dõi' })
  // getFolllower(
  //   @Param('id') id: string,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ) {
  //   if (!isUUID(id)) {
  //     throw new BadRequestException(`Invalid ID format: ${id}`);
  //   }
  //   return this.relationShipsService.getFollower(id, page, limit);
  // }

  @ResponseMessage('Danh sách người mà người dùng theo dõi')
  @Get('friends/:id')
  @ApiOperation({ summary: 'Danh sách người mà người dùng theo dõi' })
  getFollowed(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.getFollowed(id, page, limit);
  }

  @Get()
  @ResponseMessage('Get relation between 2 users successfully')
  @ApiOperation({ summary: 'Get relation between 2 users' })
  async getRelation(@User() user: IUser, @Body() dto: RelationDto) {
    if (!isUUID(dto.user_id)) {
      throw new BadRequestException(`Invalid ID format: ${dto.user_id}`);
    }
    const relation = await this.relationShipsService.getRelation(user, dto);

    return relation.relation;
  }

  @Post('update')
  @ResponseMessage('Update relation successfully')
  @ApiOperation({ summary: 'Update relation' })
  updateRelation(@User() user: IUser, @Body() dto: UpdateRelationDto) {
    return this.relationShipsService.updateRelation(user, dto);
  }
}
