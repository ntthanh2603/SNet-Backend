import { Controller } from '@nestjs/common';
import { PinMessagesService } from './pin-messages.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pin-messages')
@Controller('pin-messages')
export class PinMessagesController {
  constructor(private readonly pinMessagesService: PinMessagesService) {}
}
