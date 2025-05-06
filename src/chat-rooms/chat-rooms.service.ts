import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { RedisService } from 'src/redis/redis.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { IUser } from 'src/users/users.interface';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import logger from 'src/logger';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    private readonly redisService: RedisService,
  ) {}

  // Tìm phòng chat
  async findRoomChat(id: string): Promise<ChatRoom | null> {
    const roomCache: ChatRoom = JSON.parse(
      await this.redisService.get(`chat-romm:${id}`),
    );
    if (roomCache) return roomCache;

    const room = await this.chatRoomsRepository.findOneBy({ id: id });

    if (room)
      await this.redisService.set(`chat-romm:${id}`, JSON.stringify(room), 600);

    return room;
  }

  // Create chat room
  async create(dto: CreateChatRoomDto, user: IUser) {
    const room = new ChatRoom();
    room.name = dto.name;
    room.created_by = user.id;

    try {
      const roomDb = await this.chatRoomsRepository.save(room);

      await this.redisService.set(
        `chat-room:${roomDb.id}`,
        JSON.stringify(roomDb),
        600,
      );
      return;
    } catch (error) {
      logger.error('Create chat room failed', error);
      throw new BadRequestException('Create chat room failed');
    }
  }

  // Cập nhật phòng chat
  async update(dto: UpdateChatRoomDto, user: IUser) {
    const room = await this.findRoomChat(dto.id);

    if (!room || room.created_by !== user.id) {
      return {
        message:
          'Không tìm thấy phòng chat hoặc bạn không có quyền cập nhật đoạn chat này',
      };
    }
    await this.chatRoomsRepository.update({ id: dto.id }, { ...dto });
    await this.redisService.del(`chat-romm:${room.id}`);

    return { message: 'Cập nhật phòng chat thành công' };
  }

  // Xóa phòng chat
  async delete(id: string, user: IUser) {
    const room = await this.findRoomChat(id);

    if (!room || room.created_by !== user.id) {
      throw new NotFoundException(
        'Không tìm thấy phòng chat hoặc bạn không có quyền xóa đoạn chat này',
      );
    }

    await this.chatRoomsRepository.delete({ id });
    await this.redisService.del(`chat-romm:${room.id}`);

    return { message: 'Xóa phòng chat thành công' };
  }
}
