import { IsEmail, IsNotEmpty } from 'class-validator';

export class sendEmailDTO {
  @IsNotEmpty({ message: 'Champ email vide' })
  @IsEmail({}, { message: 'Doit etre un email valide' })
  to: string;

  @IsNotEmpty({ message: 'Champ sujet vide' })
  subject: string;

  @IsNotEmpty({ message: 'Champ contenu vide' })
  content: string;
}
