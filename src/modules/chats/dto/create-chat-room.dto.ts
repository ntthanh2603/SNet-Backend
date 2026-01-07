import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  @MaxLength(30)
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'Group Chat' })
  name: string;
}
