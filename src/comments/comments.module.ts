import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/cards/entities/card.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Card])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
