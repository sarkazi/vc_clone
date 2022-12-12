import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { DialogService } from 'src/dialog/dialog.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { MessageService } from './message.service';

@WebSocketGateway(80, { cors: true })
export class MessageGateWay {
  constructor(
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService,
  ) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('dialog:get')
  async getDialog(@MessageBody('dialogId') dialogId: number) {
    if (!dialogId) return;

    const dialog = await this.dialogService.findById(dialogId);
    this.server.emit('dialog', dialog);
  }

  @SubscribeMessage('message:add')
  async createMessage(@MessageBody() dto: CreateMessageDto) {
    await this.messageService.createMessage(dto);
  }

  @SubscribeMessage('message:get')
  async getMessages(@MessageBody() dto: GetMessagesDto) {
    console.log(dto, 999);
    await this.messageService.getMessages(dto);
  }
}
