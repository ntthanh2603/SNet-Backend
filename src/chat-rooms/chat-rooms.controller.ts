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
  Query,
} from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { isUUID } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import IdDto from 'src/helper/id.dto';
import { PaginationDto } from 'src/helper/pagination.dto';
import { UpdatePermissionAddMemberDto } from './dto/update-permission-add-member.dto';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get(':id')
  @ResponseMessage('Find chat room success')
  @ApiOperation({ summary: 'Find chat room' })
  findChatRoomById(@Param('id') id: string) {
    if (!isUUID(id)) throw new NotFoundException('Id does not type uuid');
    const room = this.chatRoomsService.findChatRoomByID(id);
    if (!room) throw new NotFoundException('Not found chat room');

    return room;
  }

  @Get('list-chat-room')
  @ResponseMessage('Get list chat room success')
  @ApiOperation({ summary: 'Get list chat room' })
  getListChatRoom(@User() user: IUser, @Query() query: PaginationDto) {
    return this.chatRoomsService.getListChatRoom(user, query);
  }

  @Post()
  @ResponseMessage('Create chat room success')
  @ApiOperation({ summary: 'Create chat room' })
  createChatRoom(@Body() dto: CreateChatRoomDto, @User() user: IUser) {
    return this.chatRoomsService.createChatRoom(dto, user);
  }

  @Patch()
  @ResponseMessage('Update name or avatar chat room success')
  @ApiOperation({ summary: 'Update name or avatar chat room' })
  @UseInterceptors(FileInterceptor('avatar-chat-room'))
  updateNameOrAvatar(
    @Body() dto: UpdateChatRoomDto,
    @User() user: IUser,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.chatRoomsService.updateNameOrAvatar(dto, user, file);
  }

  @Patch('permission-add-member')
  @ResponseMessage('Update permission add member success')
  @ApiOperation({ summary: 'Update permission add member' })
  updatePermissionAddMember(
    @Body() dto: UpdatePermissionAddMemberDto,
    @User() user: IUser,
  ) {
    return this.chatRoomsService.updatePermissionAddMember(dto, user);
  }

  @Delete()
  @ResponseMessage('Delete chat room success')
  @ApiOperation({ summary: 'Delete chat room' })
  deleteChatRoom(@Body() dto: IdDto, @User() user: IUser) {
    return this.chatRoomsService.deleteChatRoom(dto, user);
  }
}
