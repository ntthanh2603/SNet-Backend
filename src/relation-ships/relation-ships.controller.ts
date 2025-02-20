import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { RelationShipsService } from './relation-ships.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RelationShipDto } from './dto/relation-ship.dto';
import { Public, User, ResponseMessage } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { isUUID } from 'class-validator';

@ApiTags('RelationShips')
@Controller('relation-ships')
export class RelationShipsController {
  constructor(private readonly relationShipsService: RelationShipsService) {}

  @Public()
  @ResponseMessage('Danh sách người đã theo dõi người dùng')
  @Get('list_follower/:id')
  @ApiOperation({ summary: 'Danh sách người đã theo dõi người dùng' })
  listFollower(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.listFollower(id);
  }

  @Public()
  @ResponseMessage('Danh sách người mà người dùng theo dõi')
  @Get('list_followed/:id')
  @ApiOperation({ summary: 'Danh sách người mà người dùng theo dõi' })
  listFollowed(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.listFollowed(id);
  }

  // Quan hệ A và B:
  // Cập nhật DB: follower, followed của cả A và B, RelationShip: A-B
  // Cập nhật redis: user:{id_A}, user:{id_B}, list_followed:{id_A}, list_follower:{id_B}
  @Post('follow')
  @ResponseMessage('Theo dõi người dùng khác thành công')
  @ApiOperation({ summary: 'Theo dõi người dùng khác' })
  follow(@User() user: IUser, @Body() dto: RelationShipDto) {
    return this.relationShipsService.follow(user, dto);
  }

  // Quan hệ A và B:
  // Cập nhật DB: follower, followed của cả A và B, RelationShip: A-B
  // Cập nhật redis: user:{id_A}, user:{id_B}, list_followed:{id_A}, list_follower:{id_B}
  @ResponseMessage('Hủy theo dõi người dùng khác thành công')
  @ApiOperation({ summary: 'Hủy theo dõi người dùng khác' })
  @Delete('unfollow')
  unfollow(@User() user: IUser, @Body() dto: RelationShipDto) {
    return this.relationShipsService.unfollow(user, dto);
  }
}
