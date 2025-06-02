import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [
    // Import any necessary modules here, such as TypeOrmModule if you are using TypeORM
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {}
