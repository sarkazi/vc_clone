import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PostEntity } from './post/entities/post.entity';
import { CommentEntity } from './comment/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { LikesPostModule } from './likesPost/likesPost.module';
import { LikePostEntity } from './likesPost/entities/like.entity';
import { LikesCommentModule } from './likes-comment/likes-comment.module';
import { LikeCommentEntity } from './likes-comment/entities/likes-comment.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { BookmarkEntity } from './bookmarks/entities/bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'vc-clone',
      entities: [
        UserEntity,
        PostEntity,
        CommentEntity,
        LikePostEntity,
        LikeCommentEntity,
        BookmarkEntity,
      ],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './static/',
    }),
    PostModule,
    CommentModule,
    UserModule,
    AuthModule,
    LikesPostModule,
    LikesCommentModule,
    BookmarksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
