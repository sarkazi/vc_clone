import { Module } from '@nestjs/common';
import { LikesPostService } from './likesPost.service';
import { LikesPostController } from './likesPost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikePostEntity } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikePostEntity])],
  controllers: [LikesPostController],
  providers: [LikesPostService],
})
export class LikesPostModule {}
