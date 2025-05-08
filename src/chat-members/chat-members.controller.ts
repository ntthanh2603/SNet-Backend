import { Body, Controller, Post } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { RequestJoinChatRoomDto } from './dto/request-join-chat-room.dto';

@ApiTags('Chat Members')
@Controller('chat-members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  @Post()
  @ResponseMessage('Request join chat room successfully')
  @ApiOperation({
    summary: 'Request join chat room for user not exits in chat room',
  })
  requestJoinChatRoom(
    @Body() dto: RequestJoinChatRoomDto,
    @User() user: IUser,
  ) {
    return this.chatMembersService.requestJoinChatRoom(dto, user);
  }
}
