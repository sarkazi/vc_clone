import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikesCommentService } from './likes-comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

import { likeCommentDto } from './dto/like-comment.dto';

@Controller('likesComment')
export class LikesCommentController {
  constructor(private readonly likesCommentService: LikesCommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() dto: likeCommentDto) {
    return this.likesCommentService.create(userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@User() userId: number, @Body() dto: likeCommentDto) {
    console.log(dto);
    return this.likesCommentService.remove(userId, dto);
  }
}
