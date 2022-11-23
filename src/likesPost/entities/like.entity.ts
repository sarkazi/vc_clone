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

@Entity('likesPost')
export class LikePostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

  @ManyToOne(() => PostEntity, { eager: false })
  @JoinColumn({ name: 'postId' })
  postId: PostEntity;
}
