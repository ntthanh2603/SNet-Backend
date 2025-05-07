import { Body, Controller, Post } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';

@ApiTags('Chat Members')
@Controller('chat-members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  @Post()
  @ResponseMessage('Add member to chat successfully')
  @ApiOperation({ summary: 'Add member to chat' })
  addMember(@Body() dto: CreateChatMemberDto, @User() user: IUser) {
    return this.chatMembersService.addMember(dto, user);
  }
}
