import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { SendMessageDto } from './dtos/send-message-dto';

@WebSocketGateway({
  cors: {
    origin: '*', // you can restrict this in production
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(@MessageBody() chatId: string, client: Socket) {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat room: ${chatId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(@MessageBody() data: SendMessageDto) {
    const saved = await this.messageService.sendMessage(data);

    const finalChatId = saved.chat.id;

    this.server.to(finalChatId).emit('receive_message', saved);

    return saved;
  }
}
