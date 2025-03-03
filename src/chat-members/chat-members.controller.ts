import { Controller } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat Members')
@Controller('chat-members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}
}
