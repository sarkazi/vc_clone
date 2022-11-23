import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikePostEntity } from './entities/like.entity';

@Injectable()
export class LikesPostService {
  constructor(
    @InjectRepository(LikePostEntity)
    private repository: Repository<LikePostEntity>,
  ) {}
  async create(userId: number, postId: number) {
    const like = await this.repository.findOne({
      where: {
        userId: { id: userId },
        postId: { id: postId },
      },
    });

    if (like) {
      throw new NotFoundException('Вы уже реагировали на эту запись');
    }

    return await this.repository.save({
      postId: { id: postId },
      userId: { id: userId },
    });
  }

  async remove(userId: number, postId: number) {
    const like = await this.repository.findOne({
      where: {
        userId: { id: userId },
        postId: { id: postId },
      },
    });

    if (!like) {
      throw new NotFoundException('Вы еще не реагировали на эту новость');
    }

    return await this.repository.delete(like);
  }
}
