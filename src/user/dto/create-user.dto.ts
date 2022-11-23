import { IsEmail } from 'class-validator';

export class CreateUserDto {
  fullName: string;
  password?: string;
  @IsEmail(undefined, { message: 'неверная почта' })
  email: string;
}
