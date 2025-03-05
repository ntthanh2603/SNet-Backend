// src/user-search/user-search.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/customize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserDto } from './dto/search-user.dto';
import { UserSearchService } from './user-search.service';
import { generateEmbedding } from './embedding';

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

  @Get('recomendation')
  @ResponseMessage('Đề xuất người dùng để theo dõi thành công')
  @ApiOperation({ summary: 'Đề xuất người dùng để theo dõi' })
  async suggestFriends(@Query() query: SearchUserDto) {
    // return this.userSearchService.searchUser(query.text);
    return generateEmbedding('Hello world!').then(console.log);
  }
}
