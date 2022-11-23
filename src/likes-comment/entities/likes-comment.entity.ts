import { CommentEntity } from 'src/comment/entities/comment.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('likesComment')
export class LikeCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

  @ManyToOne(() => PostEntity, { eager: true })
  @JoinColumn({ name: 'postId' })
  postId: PostEntity;

  @ManyToOne(() => CommentEntity, { eager: false })
  @JoinColumn({ name: 'commentId' })
  commentId: CommentEntity;
}
