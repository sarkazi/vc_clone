import { LikeCommentEntity } from 'src/likes-comment/entities/likes-comment.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, { eager: true })
  @JoinColumn({ name: 'post' })
  post: PostEntity;

  @OneToMany(
    () => LikeCommentEntity,
    (likesComment: LikeCommentEntity) => likesComment.commentId,
    {
      eager: true,
      nullable: true,
    },
  )
  @JoinColumn({ name: 'likesCount' })
  likesCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAd: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;
}
