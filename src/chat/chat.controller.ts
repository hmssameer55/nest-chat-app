import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dtos/create-chat-dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() chatData: CreateChatDto) {
    return this.chatService.createChat(chatData);
  }

  @Get(':uid')
  async getAllChats(@Param('uid') uid: string) {
    return this.chatService.getAllChatsForUser(uid);
  }
}
