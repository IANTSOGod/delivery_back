import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { MailModule } from './mailer/mailer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../Images'),
      serveRoot: '/Images',
    }),
    UserModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [PrismaService, CloudinaryService],
})
export class AppModule {}
