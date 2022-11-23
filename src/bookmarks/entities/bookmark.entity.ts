import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikePostEntity } from 'src/likesPost/entities/like.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('bookmark')
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

  @OneToOne(() => PostEntity, { eager: true })
  @JoinColumn({ name: 'postId' })
  postId: PostEntity;
}
