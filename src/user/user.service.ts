import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async List() {
    try {
      const result = await this.prisma.user.findMany();
      if (result) {
        return result;
      } else {
        return { message: 'Aucun utilisateur actuellement' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Une erreur backend');
    }
  }
}
