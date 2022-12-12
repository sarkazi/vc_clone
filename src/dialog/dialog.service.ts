import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { DialogEntity } from './entities/dialog.entity';

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(DialogEntity)
    private repository: Repository<DialogEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) {}

  async findById(id: number) {
    console.log(id);

    const qb = await this.repository
      .createQueryBuilder('dialog')
      .whereInIds(id)
      .leftJoin('dialog.messages', 'messages')
      .leftJoin('messages.userFrom', 'userFrom')
      .leftJoin('messages.userTo', 'userTo')
      .leftJoin('dialog.userTo', 'dialogUserTo')
      .select(['dialog', 'messages', 'userFrom', 'userTo', 'dialogUserTo'])
      .getOne();

    if (!qb) throw new NotFoundException('Такого диалога нет');

    return qb;
  }

  async myDialogs(myId: number) {
    const qb = await this.repository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.messages', 'messages')
      .leftJoin('messages.userTo', 'userTo')
      .leftJoin('messages.userFrom', 'userFrom')
      .where('userTo.id = :myId', { myId })
      .orWhere('userFrom.id = :myId', { myId })
      .select(['d', 'messages', 'userTo', 'userFrom'])
      .getMany();

    return qb;
  }

  async createDialog(myId: number, userToId: number) {
    const qb = await this.repository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.messages', 'messages')
      .leftJoin('messages.userTo', 'userTo')
      .leftJoin('messages.userFrom', 'userFrom')
      .leftJoin('d.userTo', 'dialogUser')
      .where('userTo.id = :myId', { myId })
      .andWhere('userFrom.id = :userToId', { userToId })
      .orWhere('userTo.id = :userToId', { userToId })
      .andWhere('userFrom.id = :myId', { myId })
      .select(['d', 'messages', 'dialogUser'])
      .getOne();
    if (!qb) {
      await this.userService.findUser(userToId);

      const dialog = await this.repository.save({ userTo: { id: userToId } });
      return dialog;
    }
    if (qb) {
      await this.repository.update(qb.id, { userTo: { id: userToId } });

      return qb;
    }
  }
}
