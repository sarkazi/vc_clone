import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CondUserDto } from './dto/cond-user.dto';
import { CommentEntity } from 'src/comment/entities/comment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  //Создание пользователя

  async createUser(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  //  Получение пользователя по id

  findUser(id: number) {
    return this.repository.findBy({ id: id });
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

  async updateMe(id: number, filename?: string, dto?) {
    return await this.repository.update(id, {
      fullName: dto?.fullName,
      email: dto?.email,
      imageUrl: filename,
    });
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
