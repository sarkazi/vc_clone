import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { DialogEntity } from 'src/dialog/entities/dialog.entity';
import { DialogModule } from 'src/dialog/dialog.module';
import { DialogService } from 'src/dialog/dialog.service';
import { MessageGateWay } from './message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    TypeOrmModule.forFeature([DialogEntity]),
    UserModule,
    DialogModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, DialogService, MessageGateWay],
  exports: [MessageService],
})
export class MessageModule {}
