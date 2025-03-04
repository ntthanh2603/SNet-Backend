import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class PostSearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
}
