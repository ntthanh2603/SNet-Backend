import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { RelationsService } from './relations.service';
import { RelationsController } from './relations.controller';
import { Relation } from './entities/relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relation]),
    forwardRef(() => UsersModule),
  ],
  controllers: [RelationsController],
  providers: [RelationsService],
})
export class RelationsModule {}
