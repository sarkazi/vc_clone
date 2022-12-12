import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { GetMessagesDto } from './dto/get-messages.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createMessage(@Body() dto: CreateMessageDto) {
    return this.messageService.createMessage(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMessages(@Query() dto: GetMessagesDto) {
    return this.messageService.getMessages(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteMessage(@Body() dto: DeleteMessageDto) {
    return this.messageService.deleteMessage(dto);
  }
}
