import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { sendEmailDTO } from 'src/dto/send.email';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ to, subject, content }: sendEmailDTO): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: content,
        html: `<p>${content}</p>`,
      });
      console.log('Email envoyé avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      throw error;
    }
  }
}
