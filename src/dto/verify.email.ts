import { IsNotEmpty, IsEmail } from 'class-validator';

export class verifyEmailDto {
  @IsNotEmpty({ message: 'Email ne peut pas etre vide' })
  @IsEmail({}, { message: 'Email non valide' })
  email: string;
}
