import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from 'src/users/users.interface';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { RequestJoinChatRoomDto } from './dto/request-join-chat-room.dto';
import { MemberType } from 'src/helper/member.enum';
import { ChatMember } from './entities/chat-member.entity';
import { WaitingMembers } from './entities/waiting-members.entity';
import { ChatRoomsService } from './chat-rooms.service';

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
    @InjectRepository(WaitingMembers)
    private readonly waitingMembersRepository: Repository<WaitingMembers>,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => ChatRoomsService))
    private readonly chatRoomService: ChatRoomsService,
    private readonly usersService: UsersService,
  ) {}

  async requestJoinChatRoom(dto: RequestJoinChatRoomDto, user: IUser) {
    try {
      const room = await this.chatRoomService.findChatRoomByID(
        dto.chat_room_id,
      );

      if (!room) throw new NotFoundException('Not found chat room');

      const member = await this.findMemberInChatRoom(dto.chat_room_id, user.id);

      if (member)
        throw new BadRequestException('You already in this chat room');

      if (room.permission_add_member === MemberType.ADMIN) {
        await this.waitingMembersRepository.save({
          chat_room_id: dto.chat_room_id,
          user_id: user.id,
        });
      } else {
        await this.chatMembersRepository.save({
          chat_room_id: dto.chat_room_id,
          user_id: user.id,
          member_type: MemberType.MEMBER,
        });
      }

      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      throw new InternalServerErrorException('Request join chat room failed');
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
    } catch {
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
