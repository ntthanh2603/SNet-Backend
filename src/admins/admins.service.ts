import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { IAdmin } from './admin.interface';
import { AddAdminDto } from './dto/add-admin.dto';
import { RoleType } from 'src/helper/role.enum';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private readonly adminRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Promotes a user to an admin role.
   *
   * @param admin - The admin performing the action.
   * @param dto - Data transfer object containing the ID of the user to be promoted.
   * @returns An object containing a success message if the user is successfully promoted.
   * @throws BadRequestException - If the user is not found or is not currently a regular user.
   * @throws InternalServerErrorException - If an error occurs during the promotion process.
   */
  async addAdmin(admin: IAdmin, dto: AddAdminDto) {
    try {
      const user = await this.usersService.findUserById(dto.user_id);

      if (user && user.role === RoleType.USER) {
        user.role = RoleType.ADMIN;
        await this.adminRepository.save(user);

        this.logger.log({
          message: 'Admin added successfully',
          userId: admin.id,
          role: admin.role,
          deviceId: admin.deviceId,
          body: dto,
        });
        return {
          message: 'Admin added successfully',
        };
      }
      throw new BadRequestException('User not found or role user is not user');
    } catch (error) {
      this.logger.error({
        message: 'Error adding admin',
        userId: admin.id,
        role: admin.role,
        deviceId: admin.deviceId,
        body: dto,
        error: error.message,
        trace: error.stack,
      });
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
