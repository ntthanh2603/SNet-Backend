import { forwardRef, Module } from '@nestjs/common';
import { RelationShipsService } from './relation-ships.service';
import { RelationShipsController } from './relation-ships.controller';
import { RelationShip } from './entities/relation-ship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RelationShip]),
    DatabaseModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [RelationShipsController],
  providers: [RelationShipsService],
})
export class RelationShipsModule {}
