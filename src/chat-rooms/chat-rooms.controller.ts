import {
  Body,
  Controller,
  Patch,
  Post,
  Get,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { isUUID } from 'class-validator';
import { DeleteChatRoomDto } from './dto/delete-chat-room.dto';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get(':id')
  @ResponseMessage('Tìm kiếm phòng chat thành công')
  @ApiOperation({ summary: 'Tìm kiếm phòng chat' })
  find(@Param('id') id: string) {
    if (!isUUID(id)) throw new NotFoundException('Id does not type uuid');
    const room = this.chatRoomsService.findRoomChat(id);
    if (!room) throw new NotFoundException('Không tìm thấy phòng chat');

    return room;
  }

  @Post()
  @ResponseMessage('Create chat room success')
  @ApiOperation({ summary: 'Create chat room' })
  create(@Body() dto: CreateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.create(dto, user);
  }

  @Patch()
  @ResponseMessage('Cập nhật phòng chat thành công')
  @ApiOperation({ summary: 'Cập nhật phòng chat' })
  update(@Body() dto: UpdateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.update(dto, user);
  }

  @Delete()
  @ResponseMessage('Delete chat room success')
  @ApiOperation({ summary: 'Delete chat room' })
  delete(@Body() dto: DeleteChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.delete(dto, user);
  }
}
