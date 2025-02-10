import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderType } from 'src/helper/helper.enum';

export class RegisterUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email không được trống' })
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  email: string;

  @MinLength(8)
  @MaxLength(15)
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @ApiProperty({ example: '12345678', description: 'password' })
  password: string;

  @ApiProperty({
    example:
      'https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/464214538_3847873238795766_3534381120677487804_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeERNvUES-Ewc2j4HXce1m_GLywINWm1i1MvLAg1abWLU6pYIN4x2gSnnSJLCVVZMBZLGiGgyvOsUUuT972wTeSv&_nc_ohc=zWi2v0scyAsQ7kNvgFDnu5B&_nc_oc=AdgByNzbtpwbL65OsJQkmAc08iWyVmuRHDZEqoyNNFS6AOw4OUrH9ovlOW64WZoXNt0&_nc_zt=23&_nc_ht=scontent.fhan17-1.fna&_nc_gid=A1UItyfa9cUhF2Ch2vcBDbZ&oh=00_AYDq6_41eNIDG6NHjOewjtn7E0NflzNwTpKLZpBnJE1Tpw&oe=67AFCDDE',
    description: 'Your avatar',
  })
  @IsOptional()
  avatar: string;

  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty({ message: 'Last username not empty' })
  @ApiProperty({
    example: 'Nguyễn Tuấn Thành',
    description: 'Your last username',
  })
  username: string;

  @ApiProperty({ example: 'Good boy', description: 'bio' })
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty({
    example: 'https://github.com/ntthanh2603',
    description: 'website',
  })
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({ example: 20, description: 'age' })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({ example: GenderType.MALE, description: 'gender' })
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ example: 'Cau Giay, Ha Noi', description: 'address' })
  @IsString()
  @IsOptional()
  address: string;
}
