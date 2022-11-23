import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
