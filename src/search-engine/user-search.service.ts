import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserSearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  async searchUser(query: SearchUserDto) {
    const { query: searchTerm } = query;

    const result = await this.elasticsearchService.search({
      index: 'users',
      body: {
        query: {
          multi_match: {
            query: searchTerm,
            fields: ['firstName', 'lastName'],
          },
        },
      },
    });

    const hits = result.hits.hits;
    return hits.map((item) => item._source);
  }
}
