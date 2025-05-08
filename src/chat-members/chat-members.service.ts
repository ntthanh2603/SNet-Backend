import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUser } from 'src/users/users.interface';
import { ChatMember } from './entities/chat-member.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import logger from 'src/logger';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { ChatRoomsService } from 'src/chat-rooms/chat-rooms.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => ChatRoomsService))
    private readonly chatRoomService: ChatRoomsService,
    private readonly usersService: UsersService,
  ) {}

  // Add member to chat conversation
  async addMember(dto: CreateChatMemberDto, user: IUser) {
    try {
      const room = await this.chatRoomService.findChatRoomByID(
        dto.chat_room_id,
      );

      const member = await this.findMemberInChatRoom(
        dto.chat_room_id,
        dto.user_id,
      );

      if (!room || member)
        throw new BadRequestException(
          'Chat room not found or member existed in chat room',
        );

      const userDb = await this.usersService.findUserById(user.id);

      await this.chatMembersRepository.save({
        chat_room_id: dto.chat_room_id,
        user_id: user.id,
        nickname: userDb.username,
      });

      return;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      logger.error('Add member to chat room failed', error);
      throw new InternalServerErrorException('Add member to chat room failed');
    }
  }

  // Find All member in chat by chat_member_id
  async findAllMember(chat_room_id: string): Promise<ChatMember[] | null> {
    try {
      const memberCache: ChatMember[] = await this.redisService.hGetAll(
        `chat-members:${chat_room_id}`,
      );

      if (memberCache) return memberCache;

      const allMember = await this.chatMembersRepository.find({
        where: { chat_room_id: chat_room_id },
      });

      if (allMember)
        allMember.map(async (member) => {
          await this.redisService.hSet(
            `chat-members:${member.chat_room_id}`,
            member.user_id,
            JSON.stringify(member),
          );
        });

      return allMember;
    } catch (error) {
      logger.error('Find all member in chat room failed', error);
      throw new BadRequestException('Find all member in chat room failed');
    }
  }

  /**
   * Finds a chat member in a specific chat room by user ID.
   *
   * First checks the Redis cache for the member. If found, returns the cached member.
   * If not found in the cache, queries the database and updates the cache if the member is found.
   *
   * @param chat_room_id - The ID of the chat room.
   * @param user_id - The ID of the user.
   * @returns A ChatMember object if found, otherwise null.
   */
  async findMemberInChatRoom(
    chat_room_id: string,
    user_id: string,
  ): Promise<ChatMember | null> {
    const memberCache: ChatMember = JSON.parse(
      await this.redisService.hGet(`chat-members:${chat_room_id}`, user_id),
    );

    if (memberCache) return memberCache;

    const memberDb = await this.chatMembersRepository.findOneBy({
      chat_room_id: chat_room_id,
      user_id: user_id,
    });
    if (memberDb)
      await this.redisService.hSet(
        `chat-members:${memberDb.chat_room_id}`,
        memberDb.user_id,
        JSON.stringify(memberDb),
      );
    return memberDb;
  }
}
