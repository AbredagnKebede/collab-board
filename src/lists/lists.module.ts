import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/boards/entities/board.entity';
import { List } from './entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, List])],
  controllers: [ListsController],
  providers: [ListsService]
})
export class ListsModule {}
