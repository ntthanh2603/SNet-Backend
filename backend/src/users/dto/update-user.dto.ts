import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { GenderType, PrivacyType } from 'src/helper/helper.enum';

export class UpdateUserDto {
  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty({ message: 'Last username not empty' })
  @ApiProperty({ example: 'Thành', description: 'Your last username' })
  username: string;

  @ApiProperty({
    example:
      'https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/464214538_3847873238795766_3534381120677487804_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeERNvUES-Ewc2j4HXce1m_GLywINWm1i1MvLAg1abWLU6pYIN4x2gSnnSJLCVVZMBZLGiGgyvOsUUuT972wTeSv&_nc_ohc=zWi2v0scyAsQ7kNvgFDnu5B&_nc_oc=AdgByNzbtpwbL65OsJQkmAc08iWyVmuRHDZEqoyNNFS6AOw4OUrH9ovlOW64WZoXNt0&_nc_zt=23&_nc_ht=scontent.fhan17-1.fna&_nc_gid=A1UItyfa9cUhF2Ch2vcBDbZ&oh=00_AYDq6_41eNIDG6NHjOewjtn7E0NflzNwTpKLZpBnJE1Tpw&oe=67AFCDDE',
    description: 'Your avatar',
  })
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: 'Good boy', description: 'bio' })
  @MinLength(5, { message: 'Bio không được nhỏ hơn 5 ký tự' })
  @MaxLength(100, { message: 'Bio không được lớn hơn 100 ký tự' })
  @IsOptional()
  bio: string;

  @ApiProperty({
    example: 'https://github.com/ntthanh2603',
    description: 'website',
  })
  @MinLength(5)
  @MaxLength(100)
  @IsOptional()
  website: string;

  @ApiProperty({ example: 20, description: 'age' })
  @Max(100, { message: 'Tuổi không được lớn hơn 100' })
  @Min(1, { message: 'Tuổi không được nhỏ hơn 1' })
  @IsOptional()
  age: number;

  @ApiProperty({ example: GenderType.MALE, description: 'gender' })
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ example: 'Cau Giay, Ha Noi', description: 'address' })
  @MinLength(5, { message: 'Địa chỉ không được nhỏ hơn 5 ký tự' })
  @MaxLength(100, { message: 'Địa chỉ không được lớn hơn 100 ký tự' })
  @IsOptional()
  address: string;

  @ApiProperty({ example: PrivacyType.PUBLIC, description: 'privacy' })
  @IsOptional()
  privacy: PrivacyType;
}
