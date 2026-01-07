import { Body, Controller, Post } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @ResponseMessage('Toggle reaction successfully')
  @ApiOperation({ summary: 'Toggle reaction (Like/Unlike)' })
  create(@Body() createReactionDto: CreateReactionDto, @User() user: IUser) {
    return this.reactionsService.toggle(createReactionDto, user);
  }
}
