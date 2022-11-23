import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkEntity } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private repository: Repository<BookmarkEntity>,
  ) {}
  async create(postId: number, userId: number) {
    const post = await this.repository.find({
      where: {
        postId: { id: postId },
        userId: { id: userId },
      },
    });

    return console.log('666');
  }
}
