import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchPostDto } from './dto/search-post.dto';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}

  //  Создание статьи

  createPost(dto: CreatePostDto, userId: number, file: Express.Multer.File) {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;
    return this.repository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: firstParagraph || '',
      user: { id: userId },
      file: file,
    });
  }

  //  Изменение статьи

  async updatePost(id: number, dto: CreatePostDto) {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;
    const post = await this.repository.findOneBy({ id: id });
    if (!post) {
      return new NotFoundException('статья не найдена');
    }
    return this.repository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: firstParagraph || '',
    });
  }

  //  Получение всех статей

  async getAll() {
    const qb = await this.repository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .loadRelationCountAndMap(
        'posts.commentsCount',
        'posts.commentsCount',
        'commentsCount',
      )
      .loadRelationCountAndMap(
        'posts.likesCount',
        'posts.likesCount',
        'likesPost',
      )
      .orderBy('posts.createdAt', 'ASC')
      .getMany();

    return qb;
  }

  //  Поиск по критерию

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('s');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.views) {
      qb.orderBy('views', dto.views);
    }
    if (dto.body) {
      qb.andWhere(`s.body ILIKE :body`);
    }
    if (dto.title) {
      qb.andWhere(`s.title ILIKE :title`);
    }
    if (dto.tag) {
      qb.andWhere(`s.tags ILIKE :tags`);
    }

    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tags: `%${dto.tag}%`,
      views: dto.views || 'DESC',
    });

    const [items, count] = await qb.getManyAndCount();

    return {
      items,
      count,
    };
  }

  //  Сортировка по популярности

  async getPopular() {
    const qb = this.repository.createQueryBuilder('p');

    qb.orderBy('views', 'DESC');
    qb.limit(10);

    const [posts, count] = await qb.getManyAndCount();

    return {
      posts,
      count,
    };
  }

  //  Получение одной статьи + increment

  async getOne(id: number) {
    const qb = this.repository.createQueryBuilder('posts');

    await qb
      .whereInIds(id)
      .update()
      .set({ views: () => 'views + 1' })
      .execute();

    const count = qb
      .leftJoinAndSelect('posts.user', 'users')
      .loadRelationCountAndMap(
        'posts.likesCount',
        'posts.likesCount',
        'likesPost',
      )
      .getOne();

    return count;
  }

  //  Удаление одной статьи

  async remove(id: number, userId: number) {
    const post = await this.repository.findOneBy({ id: id });
    if (!post) {
      return new NotFoundException('статья не найдена');
    }
    // if (post.user.id !== userId) {
    //   throw new NotFoundException('Нет доступа к редактированию этой статьи');
    // }

    return this.repository.delete(id);
  }

  //  Удаление всех статей

  async removeAll() {
    return this.repository.clear();
  }

  //  Загрузка файла

  async uploadFile(file: Express.Multer.File) {
    return file;
  }
}
