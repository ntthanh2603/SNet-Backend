import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RelationType } from 'src/helper/relation.enum';

export class UpdateRelationDto {
  @IsUUID()
  @ApiProperty({ example: '123123123123', description: 'ID user other' })
  @IsNotEmpty()
  user_id: string;

  @IsEnum(RelationType)
  @ApiProperty({ example: RelationType.FOLLOWING })
  @IsNotEmpty()
  relation: string;
}
