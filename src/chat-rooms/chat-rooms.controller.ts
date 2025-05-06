import {
  Body,
  Controller,
  Patch,
  Post,
  Get,
  Param,
  NotFoundException,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { isUUID } from 'class-validator';
import { IDChatRoomDto } from './dto/id-chat-room.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get(':id')
  @ResponseMessage('Find chat room success')
  @ApiOperation({ summary: 'Find chat room' })
  find(@Param('id') id: string) {
    if (!isUUID(id)) throw new NotFoundException('Id does not type uuid');
    const room = this.chatRoomsService.findRoomChatByID(id);
    if (!room) throw new NotFoundException('Not found chat room');

    return room;
  }

  @Post()
  @ResponseMessage('Create chat room success')
  @ApiOperation({ summary: 'Create chat room' })
  create(@Body() dto: CreateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.create(dto, user);
  }

  @Patch()
  @ResponseMessage('Update chat room success')
  @ApiOperation({ summary: 'Update chat room' })
  @UseInterceptors(FileInterceptor('avatar-chat-room'))
  update(
    @Body() dto: UpdateChatRoomDto,
    @User() user: IUser,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.chatRoomsService.update(dto, user, file);
  }

  @Delete()
  @ResponseMessage('Delete chat room success')
  @ApiOperation({ summary: 'Delete chat room' })
  delete(@Body() dto: IDChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.delete(dto, user);
  }
}
