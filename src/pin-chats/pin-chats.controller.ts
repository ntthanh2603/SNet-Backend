import { Controller } from '@nestjs/common';
import { PinChatsService } from './pin-chats.service';

@Controller('pin-chats')
export class PinChatsController {
  constructor(private readonly pinChatsService: PinChatsService) {}
}
