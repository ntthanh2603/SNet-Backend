import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteChatRoomDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '123-123-123' })
  id: string;
}
