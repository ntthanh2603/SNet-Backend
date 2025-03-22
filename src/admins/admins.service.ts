import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { IAdmin } from './admin.interface';
import { AddAdminDto } from './dto/add-admin.dto';
import { RoleType } from 'src/helper/role.enum';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private readonly adminRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async addAdmin(admin: IAdmin, dto: AddAdminDto) {
    const user = await this.usersService.findUserById(dto.user_id);

    if (user && user.role !== RoleType.USER) {
      user.role = RoleType.ADMIN;
      await this.adminRepository.save(user);
      return {
        message: 'Admin added successfully',
      };
    }
    throw new BadRequestException('User not found or role user is not user');
  }
}
