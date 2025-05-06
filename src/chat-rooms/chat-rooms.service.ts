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
import { IDChatRoomDto } from './dto/id-chat-room.dto';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    private readonly redisService: RedisService,
  ) {}

  // Find chat room by id
  async findRoomChatByID(id: string): Promise<ChatRoom | null> {
    const roomCache: ChatRoom = await this.redisService.hGetAll(
      `chat-room:${id}`,
    );
    if (roomCache) return roomCache;

    const room = await this.chatRoomsRepository.findOneBy({ id: id });

    if (room) await this.redisService.hMSet(`chat-room:${room.id}`, room);

    return room;
  }

  // Create chat room
  async create(dto: CreateChatRoomDto, user: IUser) {
    const room = new ChatRoom();
    room.name = dto.name;
    room.created_by = user.id;

    try {
      const roomDb = await this.chatRoomsRepository.save(room);

      await this.redisService.hMSet(`chat-room:${roomDb.id}`, roomDb);
      return;
    } catch (error) {
      logger.error('Create chat room failed', error);
      throw new BadRequestException('Create chat room failed');
    }
  }

  // Cập nhật phòng chat
  async update(dto: UpdateChatRoomDto, user: IUser) {
    const room = await this.findRoomChatByID(dto.id);

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

  // Delete chat room
  async delete(dto: IDChatRoomDto, user: IUser) {
    const room = await this.findRoomChatByID(dto.id);

    if (!room || room.created_by !== user.id) {
      throw new NotFoundException(
        'Not found chat room or you do not have permission to delete this chat',
      );
    }

    try {
      await this.chatRoomsRepository.delete({ id: dto.id });
      await this.redisService.del(`chat-romm:${room.id}`);

      return;
    } catch (error) {
      logger.error('Delete chat room failed', error);
      throw new BadRequestException('Delete chat room failed');
    }
  }
}
