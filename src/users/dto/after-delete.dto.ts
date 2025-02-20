import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AfterDeleteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  @ApiProperty({ example: '123123', description: 'otp' })
  otp: string;
}
