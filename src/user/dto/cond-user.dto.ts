import { IsEmail } from 'class-validator';

export class CondUserDto {
  @IsEmail(undefined, { message: 'неверная почта' })
  email?: string;
  id?: number;
  password?: string;
}
