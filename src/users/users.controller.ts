import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user-dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, // Assuming UsersService is defined and imported
  ) {}

  //create user
  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //get user by username
  @Post('findByUsername')
  public async findByUsername(@Body('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
