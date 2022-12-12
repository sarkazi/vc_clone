import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { DialogService } from './dialog.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';

@Controller('dialogs')
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}

  //

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  createDialog(@User() myId: number, @Param('id') userToId: string) {
    return this.dialogService.createDialog(myId, +userToId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  myDialogs(@User() myId: number) {
    return this.dialogService.myDialogs(myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findById(@Param('id') dialogId: number) {
    return this.dialogService.findById(dialogId);
  }
}
