import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RequestJoinChatRoomDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  chat_room_id: string;
}
