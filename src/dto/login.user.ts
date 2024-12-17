import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class UserDtoLogin {
  @IsNotEmpty({ message: 'Champ vide' })
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide." })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Min 8,Majuscule,Minuscule et un spécial',
    },
  )
  mdp: string;
}
