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
import { ApiTags } from '@nestjs/swagger';
import { RelationShipDto } from './dto/relation-ship.dto';
import { Public, User, ResponseMessage } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { isUUID } from 'class-validator';

@ApiTags('RelationShips')
@Controller('relation-ships')
export class RelationShipsController {
  constructor(private readonly relationShipsService: RelationShipsService) {}

  @Public()
  @ResponseMessage('list follower')
  @Get('list_follower/:id')
  listFollower(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.listFollower(id);
  }

  @Public()
  @ResponseMessage('list followed')
  @Get('list_followed/:id')
  listFollowed(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.relationShipsService.listFollowed(id);
  }

  @Post('follow')
  @ResponseMessage('Follow')
  follow(@User() user: IUser, @Body() dto: RelationShipDto) {
    return this.relationShipsService.follow(user, dto);
  }

  @ResponseMessage('Unfollow')
  @Delete('unfollow')
  unfollow(@User() user: IUser, @Body() dto: RelationShipDto) {
    return this.relationShipsService.unfollow(user, dto);
  }
}
