// src/user-search/user-search.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/customize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserDto } from './dto/search-user.dto';
import { UserSearchService } from './user-search.service';

@ApiTags('Search Engine')
@Controller('search-engine')
export class SearchEngineController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Get('search')
  @ResponseMessage('Tìm kiếm người dùng thành công')
  @ApiOperation({ summary: 'Tìm kiếm người dùng' })
  async searchUser(@Query() query: SearchUserDto) {
    return this.userSearchService.searchUser(query.text);
  }
}
