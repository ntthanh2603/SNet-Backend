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

  async suggestFriends(userId: string) {
    // Lấy danh sách bạn bè của user
    const relations = await this.relationRepo.find({
      where: [{ request_side: userId }, { accept_side: userId }],
    });

    const relatedUserIds = relations.map((r) =>
      r.request_side === userId ? r.accept_side : r.request_side,
    );

    // Lấy bạn bè của bạn bè nhưng chưa kết bạn với user
    const friendsOfFriends = await this.relationRepo
      .createQueryBuilder('relation')
      .where('relation.request_side IN (:...relatedUserIds)', {
        relatedUserIds,
      })
      .orWhere('relation.accept_side IN (:...relatedUserIds)', {
        relatedUserIds,
      })
      .getMany();

    const potentialUserIds = friendsOfFriends
      .map((r) =>
        relatedUserIds.includes(r.request_side)
          ? r.accept_side
          : r.request_side,
      )
      .filter((id) => id !== userId && !relatedUserIds.includes(id));

    // Truy vấn Elasticsearch để tìm người liên quan dựa trên các tiêu chí
    const result = await this.elasticsearchService.search({
      index: 'users',
      body: {
        query: {
          bool: {
            must_not: {
              terms: { _id: [userId, ...relatedUserIds] },
            },
            should: [
              { terms: { _id: potentialUserIds } }, // Ưu tiên bạn của bạn bè
              { match: { address: 'similar_address' } }, // Đề xuất người có địa chỉ tương tự
              { match: { bio: 'similar_interest' } }, // Đề xuất người có sở thích tương tự
            ],
            minimum_should_match: 1,
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}
