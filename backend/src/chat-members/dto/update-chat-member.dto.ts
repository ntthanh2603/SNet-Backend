import { PartialType } from '@nestjs/swagger';
import { CreateChatMemberDto } from './create-chat-member.dto';

export class UpdateChatMemberDto extends PartialType(CreateChatMemberDto) {}
