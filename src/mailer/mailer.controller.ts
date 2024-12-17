import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './mailer.service';
import { sendEmailDTO } from 'src/dto/send.email';

@Controller('mailer')
export class MailerController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() body: sendEmailDTO) {
    await this.emailService.sendEmail(body);
    return { message: 'Email envoyé avec succès.' };
  }
}
