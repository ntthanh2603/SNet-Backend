import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Post } from './entities/post.entity';
import { RedisModule } from 'src/redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/core/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    DatabaseModule,
    RedisModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [],
})
export class PostsModule {}
