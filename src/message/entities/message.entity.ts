import { DialogEntity } from 'src/dialog/entities/dialog.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity)
  userTo: UserEntity;

  @ManyToOne(() => DialogEntity)
  dialog: DialogEntity;

  @ManyToOne(() => UserEntity)
  userFrom: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAd: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;
}
