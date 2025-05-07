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
import IdDto from 'src/id.dto';
import { UpdatePermissionChatRoomDto } from './dto/update-permission-chat-room.dto';
import { ChatMembersService } from 'src/chat-members/chat-members.service';
import { ChatMember } from 'src/chat-members/entities/chat-member.entity';
import { MemberType } from 'src/helper/member.enum';

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
  async create(dto: CreateChatRoomDto, user: IUser) {
    try {
      const room = await this.chatRoomsRepository.save({
        name: dto.name,
        created_by: user.id,
      });
      await this.chatMembersRepository.save({
        chat_room_id: room.id,
        user_id: user.id,
        member_type: MemberType.CREATER,
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

  /**
   * Updates the permission setting for adding members to a chat room
   * @param dto Data transfer object containing room id and permission level
   * @param user Current user attempting the operation
   */
  async updatePermissionAddMember(
    dto: UpdatePermissionChatRoomDto,
    user: IUser,
  ) {
    try {
      const room = await this.findChatRoomByID(dto.id);
      if (!room) throw new NotFoundException('Not found chat room');

      const member = await this.chatMemberService.findMemberInChatRoom(
        room.id,
        user.id,
      );

      // Check update permission based on user role
      const canUpdate = this.canUpdatePermission(
        room,
        member,
        dto.permission_add_member,
      );

      if (!canUpdate) {
        throw new BadRequestException(
          'You do not have permission to update or wrong information',
        );
      }

      // Perform the update if user has permission
      await this.chatRoomsRepository.update(
        { id: dto.id },
        { permission_add_member: dto.permission_add_member },
      );

      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      logger.error('Update permission add member failed', error);
      throw new InternalServerErrorException(
        'Update permission add member failed',
      );
    }
  }

  /**
   * Checks if the user has permission to update the add member permission level
   * @param room The chat room to be updated
   * @param member The chat member attempting the update
   * @param newPermission The new permission level to be set
   * @returns Boolean indicating whether the user can perform the update
   */
  private canUpdatePermission(
    room: ChatRoom,
    member: ChatMember,
    newPermission: MemberType,
  ): boolean {
    // Case 1: Update to CREATOR level - only room creator can do this
    if (newPermission === MemberType.CREATER) {
      return (
        room.permission_add_member !== MemberType.CREATER &&
        room.created_by === member.user_id
      );
    }

    // Case 2: Update to ADMIN level
    if (newPermission === MemberType.ADMIN) {
      // From CREATOR down to ADMIN: only room creator can do this
      if (room.permission_add_member === MemberType.CREATER) {
        return member.member_type === MemberType.CREATER;
      }
      // From MEMBER up to ADMIN: ADMIN or CREATOR can do this
      if (room.permission_add_member === MemberType.MEMBER) {
        return member.member_type !== MemberType.MEMBER;
      }
    }

    // Case 3: Update to MEMBER level
    if (newPermission === MemberType.MEMBER) {
      // From CREATOR down to MEMBER: only room creator can do this
      if (room.permission_add_member === MemberType.CREATER) {
        return member.member_type === MemberType.CREATER;
      }
      // From ADMIN down to MEMBER: ADMIN or CREATOR can do this
      if (room.permission_add_member === MemberType.ADMIN) {
        return member.member_type !== MemberType.MEMBER;
      }
    }

    return false;
  }

  // Delete chat room
  async delete(dto: IdDto, user: IUser) {
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
}
