import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { MemberType } from 'src/helper/member.enum';

export class UpdatePermissionAddMemberDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEnum(MemberType)
  @ApiProperty({
    example: 'member',
  })
  permission_add_member: MemberType;
}
