import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}

  async create(dto: CreateCommentDto, id: number) {
    const comment = await this.repository.save({
      text: dto.text,
      post: { id: dto.postId },
      user: { id: id },
    });

    return this.repository.findOneBy({ id: comment.id });
  }

  async findAll(id: number) {
    const qb = this.repository.createQueryBuilder('c');
    if (id) {
      qb.where('c.post = :id', { id }).loadRelationCountAndMap(
        'c.likesCount',
        'c.likesCount',
        'likesComment',
      );
    }
    const arr = await qb
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.user', 'user')
      .getMany();
    return arr.map((el) => {
      return {
        ...el,
        post: { id: el.post.id, title: el.post.title },
      };
    });
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id: id });
  }

  update(id: number, dto: UpdateCommentDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
  removeAll() {
    return this.repository.clear();
  }
}
