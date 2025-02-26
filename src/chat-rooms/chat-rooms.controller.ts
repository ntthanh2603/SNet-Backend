import { Body, Controller, Post } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Post()
  @ResponseMessage('Tạo phòng chat thành công')
  @ApiOperation({ summary: 'Tạo đoạn chat' })
  create(@Body() dto: CreateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.create(dto, user);
  }
}
