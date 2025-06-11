import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dtos/send-message-dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  public async sendMessage(@Body() messageData: SendMessageDto) {
    return this.messageService.sendMessage(messageData);
  }

  @Get(':chatId')
  public async getMessages(@Param('chatId') chatId: string) {
    return this.messageService.getMessages(chatId);
  }
}
