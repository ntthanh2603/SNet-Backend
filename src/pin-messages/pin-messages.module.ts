import { Module } from '@nestjs/common';
import { PinMessagesService } from './pin-messages.service';
import { PinMessagesController } from './pin-messages.controller';

@Module({
  controllers: [PinMessagesController],
  providers: [PinMessagesService],
})
export class PinMessagesModule {}
