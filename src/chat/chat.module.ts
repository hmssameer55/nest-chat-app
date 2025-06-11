import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/users/user.entity';
import { Message } from 'src/message/message.entity';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [UsersModule, TypeOrmModule.forFeature([Chat, Message, User])],
  exports: [ChatService],
})
export class ChatModule {}
