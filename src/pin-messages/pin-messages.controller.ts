import { Controller } from '@nestjs/common';
import { PinMessagesService } from './pin-messages.service';

@Controller('pin-messages')
export class PinMessagesController {
  constructor(private readonly pinMessagesService: PinMessagesService) {}
}
