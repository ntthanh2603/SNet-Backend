import { IsUUID } from 'class-validator';

export class AddAdminDto {
  @IsUUID()
  user_id: string;
}
