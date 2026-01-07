import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNotiSystemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(1)
  @ApiProperty({ example: 'Thông báo hệ thống' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(1)
  @ApiProperty({ example: 'Hệ thống quá tốt' })
  message: string;
}
