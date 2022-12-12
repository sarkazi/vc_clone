import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CondUserDto } from './dto/cond-user.dto';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { FileService } from 'src/file/file.service';
import { MessageEntity } from 'src/message/entities/message.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private fileService: FileService,
  ) {}

  //Создание пользователя

  async createUser(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  //  Получение пользователя по id

  async findUser(id: number) {
    const qb = await this.repository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .leftJoin('u.messages', 'm')
      .leftJoin('m.userFrom', 'uF')
      .leftJoin('m.userTo', 'mT')
      .select(['u', 'm', 'uF', 'mT'])
      .getOne();

    if (!qb) throw new NotFoundException('Такой пользователь не найден');

    return qb;
  }

  //Получение всех пользователей

  getAllUsers() {
    return this.repository
      .createQueryBuilder('u')
      .leftJoinAndMapMany(
        'u.commentsCount',
        CommentEntity,
        'comment',
        'comment.user = u.id',
      )
      .loadRelationCountAndMap(
        'u.commentsCount',
        'u.commentsCount',
        'commentsCount',
      )
      .getMany();
  }

  //Получение пользователя по условию

  async getUserByCond(cond?: CondUserDto) {
    return await this.repository.findOneBy(cond);
  }

  //Удаление всех пользователей

  async removeAllUsers() {
    return await this.repository.clear();
  }

  //Редактирование профиля

  async updateMe(
    id: number,
    files?: { avatar?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    dto?: UpdateUserDto,
  ) {
    try {
      if (files.avatar) {
        const avatarPath = this.fileService.uploadAvatar(files.avatar[0]);

        await this.repository.update(id, {
          avatarUrl: avatarPath,
        });
      }
      if (files.cover) {
        const coverPath = this.fileService.uploadCover(files.cover[0]);

        await this.repository.update(id, {
          coverUrl: coverPath,
        });
      }

      await this.repository.update(id, {
        fullName: dto?.fullName,
        email: dto?.email,
        coverUrl: dto?.coverUrl,
      });

      return await this.repository.findOneBy({ id: id });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Ошибка на стороне сервера');
    }
  }

  //Поиск пользователя

  async searchUser(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit) || 0;
    qb.limit(dto.take) || 20;

    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }
    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :name`);
    }

    qb.setParameters({
      email: `%${dto.email}%`,
      name: `%${dto.fullName}%`,
    });

    const [users, count] = await qb.getManyAndCount();

    return {
      users,
      count,
    };
  }
}
