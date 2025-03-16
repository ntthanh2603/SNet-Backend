// src/user-search/user-search.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UserSearchBody } from './interfaces/user-search-body.interface';
import { UserSearchResult } from './interfaces/user-search-result.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Relation } from 'src/relations/entities/relation.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSearchService {
  index = 'users';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Relation) private relationRepo: Repository<Relation>,
  ) {}

  // Tìm kiếm người dùng theo query
  async searchUser(text: string) {
    const result = await this.elasticsearchService.search<UserSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: [
              'username',
              'bio',
              'id',
              'email',
              'gender',
              'address',
              'website',
            ],
          },
        },
      },
    });

    const hits = result.hits.hits;
    return hits.map((item) => item._source);
  }

  // Tạo người dùng mới
  async createUser(user: UserSearchBody): Promise<any> {
    const response = await this.elasticsearchService.index({
      index: this.index,
      id: user.id,
      body: user,
    });
    return response;
  }

  // Cập nhật thông tin người dùng
  async updateUser(id: string, user: UserSearchBody): Promise<any> {
    const response = await this.elasticsearchService.update({
      index: this.index,
      id: id,
      body: {
        doc: user,
      },
    });
    return response;
  }

  // Xóa người dùng
  async deleteUser(id: string): Promise<any> {
    const response = await this.elasticsearchService.delete({
      index: this.index,
      id: id,
    });
    return response;
  }

  // Lấy thông tin người dùng theo ID
  async getUserById(id: string) {
    const response = await this.elasticsearchService.get({
      index: this.index,
      id: id,
    });
    return response._source;
  }
}
