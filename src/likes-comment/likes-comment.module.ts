import { Module } from '@nestjs/common';
import { LikesCommentService } from './likes-comment.service';
import { LikesCommentController } from './likes-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeCommentEntity } from './entities/likes-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeCommentEntity])],
  controllers: [LikesCommentController],
  providers: [LikesCommentService],
})
export class LikesCommentModule {}
