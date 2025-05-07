import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MemberType } from 'src/helper/member.enum';

export class UpdatePermissionSendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsEnum(MemberType)
  @IsString()
  @IsNotEmpty()
  permission_send_message: MemberType;
}
