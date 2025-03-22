import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UserSearchDto } from './dto/user-search.dto';
import { UserSearchBody } from './dto/user-search-body.interface';

@Injectable()
export class UserSearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchUsers(searchDto: UserSearchDto): Promise<{
    users: UserSearchDto[];
    total: number;
  }> {
    const { query, page, limit } = searchDto;
    const from = (page - 1) * limit;

    try {
      const result = await this.elasticsearchService.search({
        index: 'users', // name index in elasticsearch
        body: {
          from,
          size: limit,
          query: {
            multi_match: {
              query,
              fields: ['id', 'username', 'email', 'bio'],
              fuzziness: 'AUTO', // Allows approximate search
              operator: 'and',
            },
          },
        },
      });

      const hits = result.hits.hits;
      const users = hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
      }));

      return {
        users,
        total:
          typeof result.hits.total === 'number'
            ? result.hits.total
            : result.hits.total.value,
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // Create/Update index user
  async indexUser(user: UserSearchBody): Promise<void> {
    await this.elasticsearchService.index({
      index: 'users',
      id: user.id,
      body: user,
    });
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: 'users',
        id: userId,
      });
    } catch (error) {
      if (error.meta?.body?.result === 'not_found') {
        throw new Error(`User with id ${userId} not found`);
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
