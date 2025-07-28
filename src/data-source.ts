import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { Board } from './boards/entities/board.entity';
import { Card } from './cards/entities/card.entity';
import { List } from './lists/entities/list.entity';
import { Comment } from './comments/entities/comment.entity';
import { EmailVerification } from './auth/email-verification/email-verification.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Project,
    Board,
    Card,
    List,
    Comment,
    EmailVerification,
  ],
  synchronize: false,
  logging: true,
});
