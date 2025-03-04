import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  query: string;
}
