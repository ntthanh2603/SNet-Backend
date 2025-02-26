import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateChatRoomDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MaxLength(30)
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'Group Chat' })
  roomName: string;

  @IsString()
  @MaxLength(300)
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'abc.png' })
  avatar: string;
}
