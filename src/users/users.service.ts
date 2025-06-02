import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Assuming User is an entity defined in your application
    private readonly userRepository: Repository<User>,
  ) {}

  // Method to create a user
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    let existingUser = undefined;

    // Check if the user already exists
    try {
      existingUser = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
    } catch {
      throw new RequestTimeoutException('Database request timed out');
    }

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  // Method to find a user by username
  public async findByUsername(username: string): Promise<User | undefined> {
    if (!username) {
      throw new BadRequestException('Username must be provided');
    }

    let user: User | undefined;
    try {
      user = await this.userRepository.findOne({
        where: { username },
      });
    } catch {
      throw new RequestTimeoutException('Database request timed out');
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
