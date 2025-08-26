import fs from 'fs';
import path from 'path';
import {Resend} from 'resend';
import {BindingScope, injectable} from '@loopback/core';
import {EMAIL_VERIFICATION_TEMPLATE_PATH, SENDER_EMAIL} from '../constants/email-constants.ts';

@injectable({scope: BindingScope.TRANSIENT})
export class ResendService {
  private client: Resend;
  private htmlTemplate: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    this.client = new Resend(apiKey);
    this.htmlTemplate = fs.readFileSync(EMAIL_VERIFICATION_TEMPLATE_PATH, 'utf8');
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
        from: SENDER_EMAIL, 
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
