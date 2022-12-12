import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikePostEntity } from 'src/likesPost/entities/like.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
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
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('dialogs')
export class DialogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.dialog, {
    eager: true,
    nullable: true,
  })
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity)
  userTo: UserEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated: Date;
}
