import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/users/user.entity';
import { CreateChatDto } from './dtos/create-chat-dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async createChat(chatData: CreateChatDto): Promise<Chat> {
    const { uid1, uid2 } = chatData;

    // 1. Check if both users exist
    const user1 = await this.userRepo.findOne({ where: { id: uid1 } });
    const user2 = await this.userRepo.findOne({ where: { id: uid2 } });

    if (!user1 || !user2) {
      throw new NotFoundException('One or both users not found');
    }

    // 2. Check if chat already exists (regardless of order)
    const existingChat = await this.chatRepo.findOne({
      where: [
        { user1: { id: uid1 }, user2: { id: uid2 } },
        { user1: { id: uid2 }, user2: { id: uid1 } },
      ],
    });

    if (existingChat) {
      throw new ConflictException('Chat already exists between users');
    }

    // 3. Create and save new chat
    const newChat = this.chatRepo.create({ user1, user2 });
    return await this.chatRepo.save(newChat);
  }

  public async getAllChatsForUser(userId: string): Promise<Chat[]> {
    const chats = await this.chatRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2', 'lastMessage'],
      order: {
        createdAt: 'DESC',
      },
    });

    return chats;
  }

  public async getChatById(id: string): Promise<Chat> {
    const chat = await this.chatRepo.findOne({
      where: { id },
      relations: ['user1', 'user2', 'messages', 'lastMessage'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  public async findOrCreateOneToOneChat(
    user1: User,
    user2: User,
  ): Promise<Chat> {
    // Check if chat already exists (either direction)
    let existing = await this.chatRepo.findOne({
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id } },
        { user1: { id: user2.id }, user2: { id: user1.id } },
      ],
    });

    if (existing) return existing;

    // Create new chat
    const newChat = this.chatRepo.create({ user1, user2 });
    return await this.chatRepo.save(newChat);
  }
}
