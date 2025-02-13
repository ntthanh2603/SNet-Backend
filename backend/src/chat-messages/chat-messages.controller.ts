import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Post()
  create(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatMessagesService.create(createChatMessageDto);
  }

  @Get()
  findAll() {
    return this.chatMessagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatMessagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatMessageDto: UpdateChatMessageDto) {
    return this.chatMessagesService.update(+id, updateChatMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatMessagesService.remove(+id);
  }
}
