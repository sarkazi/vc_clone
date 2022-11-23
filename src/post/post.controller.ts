import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Req,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

import { diskStorage } from 'multer';

import { editFileName } from 'src/utils/file-upload';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static',
        filename: editFileName,
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @User() userId: number,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.createPost(dto, userId, file);
  }
  @Get()
  getAll() {
    return this.postService.getAll();
  }
  @Get('/search')
  search(@Query() query: SearchPostDto, @Req() req) {
    return this.postService.search(req.query);
  }
  @Get('/popular')
  getPopular() {
    return this.postService.getPopular();
  }
  @Patch('/:id')
  updatePost(@Param('id') id: string, @Body() dto: CreatePostDto) {
    return this.postService.updatePost(+id, dto);
  }
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.postService.getOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId);
  }
  @Delete()
  removeAll() {}

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static',
        filename: editFileName,
      }),
    }),
  )
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.postService.uploadFile(file);
  }
}
