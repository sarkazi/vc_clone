import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DialogService } from 'src/dialog/dialog.service';
import { DialogEntity } from 'src/dialog/entities/dialog.entity';
import { UserService } from 'src/user/user.service';
import { QueryBuilder, Repository } from 'typeorm';
import { domainToASCII } from 'url';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private repository: Repository<MessageEntity>,
    private readonly dialogService: DialogService,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    await this.dialogService.findById(dto.dialogId);

    const newMessage = await this.repository.save({
      text: dto.text,
      userTo: { id: dto.userTo },
      userFrom: { id: dto.userFrom },
      dialog: { id: dto.dialogId },
    });

    return newMessage;
  }

  async getMessages(dto: GetMessagesDto) {
    const qb = await this.repository
      .createQueryBuilder('getMessagesByUser')
      .where('getMessagesByUser.userTo = :userTo', { userTo: dto.userTo })
      .andWhere('getMessagesByUser.userFrom = :userFrom', {
        userFrom: dto.userFrom,
      })
      .orWhere('getMessagesByUser.userFrom = :userTo', {
        userFrom: dto.userFrom,
      })
      .andWhere('getMessagesByUser.userTo = :userFrom', { userTo: dto.userTo })
      .leftJoinAndSelect('getMessagesByUser.userTo', 'userTo')
      .leftJoinAndSelect('getMessagesByUser.userFrom', 'userFrom')
      .select([
        'getMessagesByUser.text',
        'getMessagesByUser.createdAd',
        'userTo.fullName',
        'userTo.avatarUrl',
        'userTo.id',
        'userFrom.fullName',
        'userFrom.avatarUrl',
        'userFrom.id',
      ])
      .orderBy('getMessagesByUser.createdAd', 'ASC')
      .getMany();

    return qb;
  }

  async deleteMessage(dto: DeleteMessageDto) {
    const message = await this.repository.findOne({
      where: {
        id: dto.id,
        userTo: { id: dto.userTo },
        userFrom: { id: dto.userFrom },
      },
    });

    if (!message) {
      throw new NotFoundException('Такое сообщение не найдено');
    }

    return await this.repository.remove(message);
  }
}
