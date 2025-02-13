import { PartialType } from '@nestjs/swagger';
import { CreateChatRoomDto } from './create-chat-room.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {}
