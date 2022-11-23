import { CommentEntity } from 'src/comment/entities/comment.entity';
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
  @JoinColumn({ name: 'commentsCount' })
  commentsCount: CommentEntity;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAd: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;
}
