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
import { LikesPostService } from './likesPost.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('likesPost')
export class LikesPostController {
  constructor(private readonly likesPostService: LikesPostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  create(@User() userId: number, @Param() postId: { id: string }) {
    return this.likesPostService.create(userId, +postId.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  remove(@User() userId: number, @Param() postId: { id: string }) {
    return this.likesPostService.remove(userId, +postId.id);
  }
}
