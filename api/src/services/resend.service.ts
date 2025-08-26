import fs from 'fs';
import path from 'path';
import {Resend} from 'resend';
import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class ResendService {
  private client: Resend;
  private htmlTemplate: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    this.client = new Resend(apiKey);
    const templatePath = path.join(
      __dirname,
      '../email-templates/email-verification.html',
    );
    this.htmlTemplate = fs.readFileSync(templatePath, 'utf8');
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationCode: string,
  ) {
    const html = this.htmlTemplate
      .replace('{{first_name}}', firstName)
      .replace('{{verification_code}}', verificationCode)
      .replace('{{timestamp}}', Date.now().toString());

    const verification = await this.client.emails
      .send({
        from: 'delivered@resend.dev',
        to: [email],
        subject: 'Verify Your Email Address',
        html,
      })
      .catch(error => {
        console.error('Resend API Error Details:', error.message, error);
        throw new Error(`Verification email failed: ${error.message}`);
      });
    return verification;
  }
}
