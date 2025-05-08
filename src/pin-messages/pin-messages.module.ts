import { Module } from '@nestjs/common';
import { PinMessagesService } from './pin-messages.service';
import { PinMessagesController } from './pin-messages.controller';
import { PinMessage } from './entities/pin-messages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PinMessage])],
  controllers: [PinMessagesController],
  providers: [PinMessagesService],
})
export class PinMessagesModule {}
