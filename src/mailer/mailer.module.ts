import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './mailer.service';
import { MailerController } from './mailer.controller';

@Module({
  controllers: [MailerController],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.APPLICATION_MDP,
        },
      },
      defaults: {
        from: '"Nom de l\'expéditeur" <iantsochristianrazafindrazaka@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailerModule],
  providers: [EmailService],
})
export class MailModule {}
