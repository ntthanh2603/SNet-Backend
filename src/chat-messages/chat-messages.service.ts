import { Injectable } from '@nestjs/common';
import { ChatMessage } from './entities/chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}
  async createMessage(
    dto: CreateChatMessageDto,
    user: IUser,
    file: Express.Multer.File,
  ) {}
}
