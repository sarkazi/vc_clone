import { forwardRef, Module } from '@nestjs/common';
import { DialogService } from './dialog.service';
import { DialogController } from './dialog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogEntity } from './entities/dialog.entity';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { MessageEntity } from 'src/message/entities/message.entity';
import { MessageGateWay } from 'src/message/message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([DialogEntity]),
    TypeOrmModule.forFeature([MessageEntity]),
    UserModule,
  ],
  controllers: [DialogController],
  providers: [DialogService],
  exports: [DialogService],
})
export class DialogModule {}
