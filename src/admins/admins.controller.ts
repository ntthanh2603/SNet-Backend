import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { Admin } from 'src/decorator/customize';
import { IAdmin } from './admin.interface';
import { AddAdminDto } from './dto/add-admin.dto';

@Controller('admins')
@ApiTags('Admins')
@UseGuards(AdminGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}
  @Post('addAdmin')
  @ApiOperation({ summary: 'Admin: Add Admin' })
  addAdmin(@Admin() admin: IAdmin, @Body() dto: AddAdminDto) {
    return this.adminsService.addAdmin(admin, dto);
  }
}
