import { Controller } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}
}
