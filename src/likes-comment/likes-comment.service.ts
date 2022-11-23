import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { likeCommentDto } from './dto/like-comment.dto';
import { LikeCommentEntity } from './entities/likes-comment.entity';

@Injectable()
export class LikesCommentService {
  constructor(
    @InjectRepository(LikeCommentEntity)
    private repository: Repository<LikeCommentEntity>,
  ) {}
  async create(userId: number, dto: likeCommentDto) {
    const like = await this.repository.findOne({
      where: {
        userId: { id: userId },
        postId: { id: dto.postId },
        commentId: { id: dto.commentId },
      },
    });

    if (like) {
      throw new NotFoundException('Вы уже реагировали на этот комментарий');
    }

    return await this.repository.save({
      userId: { id: userId },
      postId: { id: dto.postId },
      commentId: { id: dto.commentId },
    });
  }

  async remove(userId: number, dto: likeCommentDto) {
    const like = await this.repository.findOne({
      where: {
        userId: { id: userId },
        postId: { id: dto.postId },
        commentId: { id: dto.commentId },
      },
    });

    if (!like) {
      throw new NotFoundException('Вы еще не реагировали на этот комментарий');
    }

    return await this.repository.delete(like);
  }
}
