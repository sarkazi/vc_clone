import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikePostEntity } from 'src/likesPost/entities/like.entity';
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

import { OutputBlockData } from '../dto/create-post.dto';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @Column('jsonb', { default: [{ text: null }] })
  body: OutputBlockData[];

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => LikePostEntity, (likes: LikePostEntity) => likes.postId, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'likesCount' })
  likesCount: number;

  @OneToMany(() => CommentEntity, (comments: CommentEntity) => comments.post, {
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'commentsCount' })
  commentsCount: number;

  @Column('text', { array: true, nullable: true })
  tags?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated: Date;
}
