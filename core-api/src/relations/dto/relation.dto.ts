import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RelationType } from 'src/helper/relation.enum';

export class RelationDto {
  @IsUUID()
  @ApiProperty({ example: '123123123123', description: 'user_id' })
  @IsNotEmpty()
  user_id: string;

  @IsEnum(RelationType)
  relation: RelationType;
}
