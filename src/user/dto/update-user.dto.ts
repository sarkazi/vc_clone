import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  fullName?: string;
  password?: string;
  //  @IsEmail(undefined, { message: 'неверная почта' })
  email?: string;
  coverUrl?: null;
}
