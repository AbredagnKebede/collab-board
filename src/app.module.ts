import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { CardsModule } from './cards/cards.module';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, BoardsModule, ListsModule, CardsModule, CommentsModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
