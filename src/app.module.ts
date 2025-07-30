import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Board } from './users/board.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host:'localhost',
    port: 3306,
    username: 'root',
    password: 'cn@@1234',
    database: 'user',
    entities: [User,Board],
    synchronize: true,
  }),
UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
