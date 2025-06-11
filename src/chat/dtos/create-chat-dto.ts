import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @MinLength(3)
  uid1: string;

  @IsNotEmpty()
  @MinLength(3)
  uid2: string;
}
