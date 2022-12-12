import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private fileService: FileService,
  ) {}

  //валидация

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByCond({ email, password });

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //генерация токена

  generateJwtToken(data: { id: number; email: string }) {
    const payload = { sub: data.id, email: data.email };
    return this.jwtService.sign(payload);
  }

  //логин

  async login(user: any) {
    const payload = { sub: user.userId, email: user.email };
    return {
      ...user,
      access_token: this.generateJwtToken(user),
    };
  }

  //регистрация

  async register(dto: CreateUserDto) {
    try {
      const { password, ...user } = await this.userService.createUser({
        fullName: dto.fullName,
        email: dto.email,
        password: dto.password,
      });

      return {
        ...user,
        access_token: this.generateJwtToken(user),
      };
    } catch (err) {
      console.log(err);
      throw new ForbiddenException(err);
    }
  }
}
