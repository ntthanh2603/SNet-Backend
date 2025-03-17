import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UserSearchDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  query: string;

  page?: number = 1;
  limit?: number = 10;
}
