import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  UploadedFile,
  Res,
  CacheInterceptor,
  StreamableFile,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/utils/file-upload';
import { CondUserDto } from './dto/cond-user.dto';

import formidable from 'formidable';

import { FormDataRequest } from 'nestjs-form-data';
import { createReadStream } from 'fs';
import { join } from 'path';
import bodyParser from 'body-parser';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //поиск по условию

  @Get()
  getUserByCond(@Body() cond?: CondUserDto) {
    return this.userService.getUserByCond(cond);
  }

  //Получение всех пользователей

  @Get('/everything')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  //аутентификация

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Request() req) {
    return this.userService.findUser(req.user.id);
  }

  //  редактирование пользователя

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
    ]),
  )
  updateMe(
    @Request() req,
    @Body() dto?: UpdateUserDto,
    @UploadedFiles()
    files?: { avatar?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    console.log(dto, 777777);
    return this.userService.updateMe(req.user.id, files, dto);
  }

  //  удаление всех пользователей

  @Delete()
  removeAllUsers() {
    return this.userService.removeAllUsers();
  }

  //  поиск пользователя

  @Get('/search')
  searchUser(@Query() dto: SearchUserDto) {
    return this.userService.searchUser(dto);
  }

  //  поиск по id

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findUser(+id);
  }
}
