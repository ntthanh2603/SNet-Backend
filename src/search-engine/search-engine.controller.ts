import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSearchService } from './user-search.service';
import { UserSearchDto } from './dto/user-search.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { UserSearchBody } from './dto/user-search-body.interface';

@ApiTags('Search Engine')
@Controller('searchEngine')
export class SearchEngineController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Public()
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

  @Post('index')
  @Public()
  @HttpCode(201)
  @ResponseMessage('create index user full text success')
  @ApiOperation({ summary: 'create index user full text' })
  async indexUser(@Body() user: UserSearchBody) {
    try {
      await this.userSearchService.indexUser(user);
      return {
        success: true,
        message: 'User indexed successfully',
        data: {
          id: user.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to index user: ${error.message}`,
      };
    }
  }
}
