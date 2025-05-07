import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatMemberDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  chat_room_id: string;
}
