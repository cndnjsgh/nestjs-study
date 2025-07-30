import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Board } from './board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Board])],
  exports: [TypeOrmModule,UsersService],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
