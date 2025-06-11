// message/message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/users/user.entity';
import { SendMessageDto } from './dtos/send-message-dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly chatService: ChatService,
  ) {}

  public async sendMessage(data: SendMessageDto): Promise<Message> {
    const { sender_id, receiver_id, content, chat_id } = data;

    const sender = await this.userRepo.findOne({ where: { id: sender_id } });
    if (!sender) throw new NotFoundException('Sender not found');

    let chat: Chat | null = null;

    if (chat_id) {
      // ✅ Existing chat — use it
      chat = await this.chatRepo.findOne({ where: { id: chat_id } });
      if (!chat) throw new NotFoundException('Chat not found');
    } else {
      const receiver = await this.userRepo.findOne({
        where: { id: receiver_id },
      });
      if (!receiver) throw new NotFoundException('Receiver not found');

      chat = await this.chatService.findOrCreateOneToOneChat(sender, receiver);
    }

    const message = this.messageRepo.create({
      content,
      sender,
      chat,
    });

    const savedMessage = await this.messageRepo.save(message);

    // ✨ optionally update `lastMessage` for chat
    chat.lastMessage = savedMessage;
    await this.chatRepo.save(chat);

    return savedMessage;
  }

  public async getMessages(chatId: string): Promise<Message[]> {
    const chat = await this.chatRepo.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    return this.messageRepo.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
