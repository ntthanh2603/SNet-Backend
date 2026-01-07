import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/users/users.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Chat Messages')
@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Post()
  @ResponseMessage('Create message to chat successfully')
  @ApiOperation({ summary: 'Create message to chat' })
  @UseInterceptors(FilesInterceptor('medias-messages'))
  createMessage(
    @Body() dto: CreateChatMessageDto,
    @User() user: IUser,
    @UploadedFiles()
    file: Express.Multer.File,
  ) {
    return this.chatMessagesService.createMessage(dto, user, file);
  }
}
