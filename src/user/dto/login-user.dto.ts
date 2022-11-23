import { IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail(undefined, { message: 'неверная почта' })
  email: string;
  password: string;
}
