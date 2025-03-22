import { Module } from '@nestjs/common';
import { SearchEngineController } from './search-engine.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSearchService } from './user-search.service';
import { PostSearchService } from './post-search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Relation } from 'src/relations/entities/relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Relation]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_HOSTS'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
        maxRetries: 10,
        requestTimeout: 60000,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SearchEngineController],
  providers: [UserSearchService, PostSearchService],
  exports: [UserSearchService, PostSearchService],
})
export class SearchEngineModule {}
