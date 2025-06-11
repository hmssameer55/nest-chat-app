import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsNotEmpty()
  @MinLength(3)
  sender_id: string;

  @IsNotEmpty()
  @MinLength(3)
  receiver_id: string;

  @IsOptional()
  @MinLength(3)
  chat_id: string;
}
