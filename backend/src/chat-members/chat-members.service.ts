import { Injectable } from '@nestjs/common';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { UpdateChatMemberDto } from './dto/update-chat-member.dto';

@Injectable()
export class ChatMembersService {
  create(createChatMemberDto: CreateChatMemberDto) {
    return 'This action adds a new chatMember';
  }

  findAll() {
    return `This action returns all chatMembers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatMember`;
  }

  update(id: number, updateChatMemberDto: UpdateChatMemberDto) {
    return `This action updates a #${id} chatMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatMember`;
  }
}
