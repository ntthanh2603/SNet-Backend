import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RelationDto {
  @IsUUID()
  @ApiProperty({ example: '123123123123', description: 'userId1' })
  @IsNotEmpty()
  accept_side: string;
}
