import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RelationShipDto {
  @IsUUID()
  @ApiProperty({ example: '123123123123', description: 'userId1' })
  @IsNotEmpty()
  user_id_other: string;
}
