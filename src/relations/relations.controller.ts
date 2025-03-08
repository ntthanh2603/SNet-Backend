import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, User, ResponseMessage } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { isUUID } from 'class-validator';
import { RelationDto } from './dto/relation.dto';
import { RelationsService } from './relations.service';

@ApiTags('Relations')
@Controller('relations')
export class RelationsController {
  constructor(private readonly relationShipsService: RelationsService) {}

  @Public()
  @ResponseMessage('Danh sách bạn bè')
  @Get('friends/:id')
  @ApiOperation({ summary: 'Danh sách bạn bè' })
  getFriends(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.getFriends(id, page, limit);
  }

  @Public()
  @ResponseMessage('Danh sách người theo dõi')
  @Get('friends/:id')
  @ApiOperation({ summary: 'Danh sách người theo dõi' })
  getFolllower(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.getFollower(id, page, limit);
  }

  @Public()
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
  @ResponseMessage('Quan hệ 2 người dùng')
  @ApiOperation({ summary: 'Quan hệ 2 người dùng' })
  getRelation(@User() user: IUser, @Body() dto: RelationDto) {
    if (!isUUID(dto.user_id)) {
      throw new BadRequestException(`Invalid ID format: ${dto.user_id}`);
    }
    return this.relationShipsService.getRelation(user, dto.user_id);
  }

  @Post('follow')
  @ResponseMessage('Theo dõi người dùng khác thành công')
  @ApiOperation({ summary: 'Theo dõi người dùng khác' })
  follow(@User() user: IUser, @Body() dto: RelationDto) {
    return this.relationShipsService.follow(user, dto);
  }

  @ResponseMessage('Hủy theo dõi người dùng khác thành công')
  @ApiOperation({ summary: 'Hủy theo dõi người dùng khác' })
  @Delete('unfollow')
  unfollow(@User() user: IUser, @Body() dto: RelationDto) {
    return this.relationShipsService.unfollow(user, dto);
  }

  @Post('accept-friend')
  @ResponseMessage('Chấp nhận kết bạn thành công')
  @ApiOperation({ summary: 'Chấp nhận kết bạn' })
  acceptFriend(@User() user: IUser, @Body() dto: RelationDto) {
    return this.relationShipsService.acceptFriend(user, dto);
  }

  @ResponseMessage('Hủy kết bạn thành công')
  @ApiOperation({ summary: 'Hủy kết bạn' })
  @Delete('unfriend')
  unFriend(@User() user: IUser, @Body() dto: RelationDto) {
    return this.relationShipsService.unFriend(user, dto);
  }
}
