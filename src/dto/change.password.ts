import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class changePasswordDto {
  @IsNotEmpty({ message: 'Ne peut pas etre vide' })
  @IsEmail({}, { message: 'Entrez un email valide' })
  email: string;
  @IsNotEmpty({ message: 'Mdp ne peut pas etre vide' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Min 8,Majuscule,Minuscule et un spécial',
    },
  )
  newMdp: string;
}
