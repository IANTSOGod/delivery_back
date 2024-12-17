import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { UserDtoLogin } from 'src/dto/login.user';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as QRCode from 'qrcode';
import { join } from 'path';
import * as fs from 'fs';
import { UserDtoSignUp } from 'src/dto/signUp.user';
import { verifyEmailDto } from 'src/dto/verify.email';
import { changePasswordDto } from 'src/dto/change.password';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async Login({ email, mdp }: UserDtoLogin) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser) {
      const res = await compare(mdp, findUser.mdp);
      if (res) {
        return {
          id: findUser.id,
          email: findUser.email,
          username: findUser.username,
          profile: findUser.profile,
          qrCode: findUser.qrCode,
        };
      } else {
        return { message: 'Mot de passe incorrect' };
      }
    } else {
      return { message: 'Email non enregistré' };
    }
  }

  async SignUp({ username, email, mdp }: UserDtoSignUp) {
    if (username && email && mdp) {
      try {
        const findUser = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (findUser) {
          throw new Error('Cet utilisateur existe déja');
        } else {
          const hashed = await hash(mdp, 10);
          const createdUser = await this.prisma.user.create({
            data: {
              email: email,
              mdp: hashed,
              username: username,
              qrCode: '',
              profile: '',
            },
          });
          if (createdUser) {
            const qrData = `id: ${createdUser.id}\nemail: ${createdUser.email}\n username: ${createdUser.username}`;
            const qrDirectory = join(__dirname, '../../Images/qr');
            const qrPath = join(qrDirectory, `user_${createdUser.id}.png`);

            if (!fs.existsSync(qrDirectory)) {
              fs.mkdirSync(qrDirectory, { recursive: true });
            }
            try {
              await QRCode.toFile(qrPath, qrData);
            } catch (error) {
              console.log(error);
              return { message: 'Erreur lors de la génération de QRCODe' };
            }

            const result = await this.cloudinaryService.uploadImage(qrPath);

            const newUser = await this.prisma.user.update({
              where: {
                id: createdUser.id,
              },
              data: {
                qrCode: result.secure_url,
              },
            });
            return newUser;
          } else {
            return { message: 'Erreur lors de la création' };
          }
        }
      } catch (error) {
        console.log(error);
        throw new Error('Erreur de fetch');
      }
    }
  }

  async UpdateProfilPics({
    id,
    file,
  }: {
    id: number;
    file: Express.Multer['File'];
  }) {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file.path);
      const userWithProfilePics = await this.prisma.user.update({
        where: { id: id },
        data: { profile: uploadResult.secure_url },
      });
      return userWithProfilePics;
    } catch (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }

  async verifyExistingEmail({ email }: verifyEmailDto) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (findUser) {
        return findUser;
      } else {
        return { message: 'Email non enregistré' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Erreur de fetch');
    }
  }

  async changePassword({ email, newMdp }: changePasswordDto) {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          mdp: newMdp,
        },
      });
      return updateUser;
    } catch (error) {
      console.log(error);
      throw new Error('Erreur de fetch');
    }
  }
}
