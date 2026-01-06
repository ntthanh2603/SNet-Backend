import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateChatMessageDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  chat_room_id: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  medias: string;
}
