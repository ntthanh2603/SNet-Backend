import { IsNotEmpty, IsUUID } from 'class-validator';

export default class IdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
