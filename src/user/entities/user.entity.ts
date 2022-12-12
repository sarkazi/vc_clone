import { CommentEntity } from 'src/comment/entities/comment.entity';
import { DialogEntity } from 'src/dialog/entities/dialog.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
import { PostEntity } from 'src/post/entities/post.entity';
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

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => CommentEntity, (comments: CommentEntity) => comments.user, {
    eager: false,
    nullable: true,
  })
  commentsCount: CommentEntity;

  @OneToMany(() => PostEntity, (posts: PostEntity) => posts.user, {
    eager: false,
    nullable: true,
  })
  posts: PostEntity;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  coverUrl?: string;

  @OneToMany(
    () => MessageEntity,
    (message: MessageEntity) => message.userFrom,
    {
      eager: true,
      nullable: true,
    },
  )
  messages: MessageEntity[];

  @OneToMany(() => DialogEntity, (dialog: DialogEntity) => dialog.userTo, {
    eager: true,
    nullable: true,
  })
  dialogs: DialogEntity[];

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAd: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;
}
