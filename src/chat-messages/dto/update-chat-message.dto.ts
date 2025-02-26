import { PartialType } from '@nestjs/swagger';
import { CreateChatMessageDto } from './create-chat-message.dto';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {}
