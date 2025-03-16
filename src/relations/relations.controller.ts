import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Param,
  Query,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, ResponseMessage } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { RelationDto } from './dto/relation.dto';
import { RelationsService } from './relations.service';
import { UpdateRelationDto } from './dto/update-relation.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('Relations')
@Controller('relations')
export class RelationsController {
  constructor(
    private readonly relationShipsService: RelationsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  @ResponseMessage(
    `Get list relation ['friend', 'following', 'block'] of user successfully`,
  )
  @Get('friends/:user_id')
  @ApiOperation({
    summary: `Get list relation ['friend', 'following', 'block'] of user`,
  })
  async friends(
    @User() user: IUser,
    @Param() params: RelationDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const privacy = await this.usersService.privacySeeProfile(
      user.id,
      params.user_id,
    );
    if (!privacy) {
      throw new BadRequestException('You are not allowed to see list friend');
    }
    return this.relationShipsService.getListRelation(
      params.user_id,
      page,
      limit,
      params.relation,
    );
  }

  @Get(':user_id')
  @ResponseMessage('Get relation between 2 users successfully')
  @ApiOperation({ summary: 'Get relation between 2 users' })
  async getRelation(@User() user: IUser, @Param() params: RelationDto) {
    const relation = await this.relationShipsService.getRelation(
      user.id,
      params.user_id,
    );

    return relation;
  }

  @Post('update')
  @ResponseMessage('Update relation successfully')
  @ApiOperation({ summary: 'Update relation' })
  updateRelation(@User() user: IUser, @Body() dto: UpdateRelationDto) {
    return this.relationShipsService.updateRelation(user, dto);
  }
}
