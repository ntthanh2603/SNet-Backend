import { Controller } from '@nestjs/common';
import { PinChatsService } from './pin-chats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pin Chats')
@Controller('pin-chats')
export class PinChatsController {
  constructor(private readonly pinChatsService: PinChatsService) {}
}
