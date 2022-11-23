import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  fullName?: string;
  password?: string;
  //  imageUrl?: Express.Multer.File;
  @IsEmail(undefined, { message: 'неверная почта' })
  email?: string;
}
