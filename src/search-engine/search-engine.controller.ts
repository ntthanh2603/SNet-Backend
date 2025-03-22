import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSearchService } from './user-search.service';
import { UserSearchDto } from './dto/user-search.dto';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('Search Engine')
@Controller('searchEngine')
export class SearchEngineController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Get('searchUser')
  @ResponseMessage('Search user full text success')
  @ApiOperation({ summary: 'Search user full text' })
  async searchUsers(@Query() searchDto: UserSearchDto) {
    const result = await this.userSearchService.searchUsers(searchDto);
    return {
      success: true,
      data: result.users,
      meta: {
        total: result.total,
        page: searchDto.page,
        limit: searchDto.limit,
      },
    };
  }
}
