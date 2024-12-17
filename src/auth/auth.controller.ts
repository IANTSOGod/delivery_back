import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDtoLogin } from 'src/dto/login.user';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './Multer/multer.profile.options';
import { UserDtoSignUp } from 'src/dto/signUp.user';
import { verifyEmailDto } from 'src/dto/verify.email';
import { changePasswordDto } from 'src/dto/change.password';
import { hash } from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Login')
  async Login(@Body() body: UserDtoLogin) {
    return this.authService.Login(body);
  }

  @Post('SignUp')
  async SignUp(@Body() body: UserDtoSignUp) {
    return this.authService.SignUp(body);
  }

  @Post('profilePics')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateProfilePicture(
    @Body('id') id: string,
    @UploadedFile() file: Express.Multer['File'],
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const UserId = parseInt(id);
      const updatedUser = await this.authService.UpdateProfilPics({
        id: UserId,
        file: file,
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating profile picture',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('changePassword')
  async changePassword(@Body() body: changePasswordDto) {
    try {
      const verifyUser = await this.authService.verifyExistingEmail({
        email: body.email,
      } as verifyEmailDto);
      if (verifyUser) {
        const hashed = await hash(body.newMdp, 10);
        const changedUser = await this.authService.changePassword({
          email: body.email,
          newMdp: hashed,
        });
        if (changedUser) {
          return changedUser;
        } else {
          return { message: 'erreur inconnue' };
        }
      } else {
        return { message: 'Email non enregistré' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Erreur inconnue');
    }
  }
}
