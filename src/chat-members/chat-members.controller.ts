import { Controller } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';

@Controller('chat-members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}
}
