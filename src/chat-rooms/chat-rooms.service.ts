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
import deleteFile from 'src/helper/deleteFile';
import IdDto from 'src/id.dto';
import { UpdatePermissionChatRoomDto } from './dto/update-permission-chat-room.dto';
import { ChatMembersService } from 'src/chat-members/chat-members.service';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    private readonly redisService: RedisService,
    private readonly chatMemberService: ChatMembersService,
  ) {}

  // Find chat room by id
  async findRoomChatByID(id: string): Promise<ChatRoom | null> {
    try {
      const roomCache: ChatRoom = await this.redisService.hGetAll(
        `chat-room:${id}`,
      );

      if (roomCache) return roomCache;

      const room = await this.chatRoomsRepository.findOneBy({ id: id });

      if (room) await this.redisService.hMSet(`chat-room:${room.id}`, room);

      return room;
    } catch (error) {
      logger.error('Find chat room failed', error);
      throw new BadRequestException('Find chat room failed');
    }
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

  // Update name or avatar chat room
  async updateNameOrAvatar(
    dto: UpdateChatRoomDto,
    user: IUser,
    file: Express.Multer.File,
  ) {
    const room = await this.findRoomChatByID(dto.id);

    if (!room || room.created_by !== user.id)
      throw new NotFoundException(
        'Not found chat room or you do not have permission to update this chat',
      );

    try {
      if (!file) {
        await this.chatRoomsRepository.update(
          { id: dto.id },
          { name: dto.name },
        );
      } else {
        deleteFile(room.avatar);

        await this.chatRoomsRepository.update(
          { id: dto.id },
          {
            name: dto.name,
            avatar: file.path,
          },
        );
      }
      await this.redisService.del(`chat-room:${room.id}`);
      return;
    } catch (error) {
      logger.error('Update chat room failed', error);
      throw new BadRequestException('Update chat room failed');
    }
  }

  async updatePermissionAddMember(
    dto: UpdatePermissionChatRoomDto,
    user: IUser,
  ) {
    const room = await this.findRoomChatByID(dto.id);
    return;
  }

  // Delete chat room
  async delete(dto: IdDto, user: IUser) {
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
