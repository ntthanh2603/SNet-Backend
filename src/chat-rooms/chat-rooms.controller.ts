import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Post('')
  @ResponseMessage('Tạo phòng chat thành công')
  @ApiOperation({ summary: 'Tạo đoạn chat' })
  create(@Body() dto: CreateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.create(dto, user);
  }

  @Patch()
  @ResponseMessage('Cập nhật phòng chat thành công')
  @ApiOperation({ summary: 'Cập nhật phòng chat' })
  update(@Body() dto: UpdateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.update(dto, user);
  }
}
