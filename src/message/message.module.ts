import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/chat.entity';
import { Message } from './message.entity';
import { User } from 'src/users/user.entity';
import { MessageGateway } from './message.gateway';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  providers: [MessageService, MessageGateway],
  controllers: [MessageController],
  imports: [
    UsersModule,
    ChatModule,
    TypeOrmModule.forFeature([Chat, Message, User]),
  ],
})
export class MessageModule {}
