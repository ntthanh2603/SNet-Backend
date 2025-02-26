import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { RedisService } from 'src/redis/redis.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    private readonly redisService: RedisService,
  ) {}
  async create(dto: CreateChatRoomDto, user: IUser) {
    const room = { createdBy: user.id, ...dto };
    await this.chatRoomsRepository.save(room);
    return { message: 'Tạo phòng chat thành công' };
  }
}
