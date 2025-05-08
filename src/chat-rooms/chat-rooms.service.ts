import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { ChatMembersService } from 'src/chat-members/chat-members.service';
import { ChatMember } from 'src/chat-members/entities/chat-member.entity';
import { MemberType } from 'src/helper/member.enum';
import IdDto from 'src/helper/id.dto';
import { PaginationDto } from 'src/helper/pagination.dto';
import { UpdatePermissionAddMemberDto } from './dto/update-permission-add-member.dto';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => ChatMembersService))
    private readonly chatMemberService: ChatMembersService,
  ) {}

  // Find chat room by id
  async findChatRoomByID(id: string): Promise<ChatRoom | null> {
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
  async createChatRoom(dto: CreateChatRoomDto, user: IUser) {
    try {
      const room = await this.chatRoomsRepository.save({
        name: dto.name,
        created_by: user.id,
      });
      await this.chatMembersRepository.save({
        chat_room_id: room.id,
        user_id: user.id,
        member_type: MemberType.ADMIN,
      });

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
    const room = await this.findChatRoomByID(dto.id);

    const member = await this.chatMemberService.findMemberInChatRoom(
      dto.id,
      user.id,
    );

    if (!room || !member)
      throw new NotFoundException(
        'Not found chat room or you do not in this chat',
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

  // Update permission add member
  async updatePermissionAddMember(
    dto: UpdatePermissionAddMemberDto,
    user: IUser,
  ) {
    try {
      const room = await this.findChatRoomByID(dto.id);

      const member = await this.chatMemberService.findMemberInChatRoom(
        dto.id,
        user.id,
      );

      console.log('room', room);
      console.log('member', member);

      if (
        room &&
        member &&
        room.permission_add_member !== dto.new_permission_add_member &&
        member.member_type === MemberType.ADMIN
      ) {
        await this.chatRoomsRepository.update(
          { id: room.id },
          { permission_add_member: dto.new_permission_add_member },
        );
        return;
      }

      throw new BadRequestException(
        'Can not update permission add member because you are not admin or wrong input',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      logger.error('Update permission add member failed', error);
      throw new InternalServerErrorException(
        'Update permission add member failed',
      );
    }
  }

  // Delete chat room
  async deleteChatRoom(dto: IdDto, user: IUser) {
    const room = await this.findChatRoomByID(dto.id);

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

  async getListChatRoom(user: IUser, query: PaginationDto) {
    const { page, limit } = query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const skip = (page - 1) * limit;

    const chatRooms = ['temp'];
    return {
      data: chatRooms,
      meta: {
        page: page,
        limit: limit,
      },
    };
  }
}
