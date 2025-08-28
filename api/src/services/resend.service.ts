import fs from 'fs';
import {Resend} from 'resend';
import {BindingScope, injectable} from '@loopback/core';
import {
  EMAIL_VERIFICATION_TEMPLATE_PATH,
  SENDER_EMAIL,
} from '../constants/email-constants.ts';

@injectable({scope: BindingScope.TRANSIENT})
export class ResendService {
  private client: Resend;
  private htmlTemplate: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    this.client = new Resend(apiKey);
    this.htmlTemplate = fs.readFileSync(
      EMAIL_VERIFICATION_TEMPLATE_PATH,
      'utf8',
    );
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationCode: string,
  ) {
    try {
      if (!this.client) {
        throw new Error('Resend client not initialized');
      }

      if (!this.htmlTemplate) {
        throw new Error('Email template not loaded');
      }

      const html = this.htmlTemplate
        .replace('{{first_name}}', firstName)
        .replace('{{verification_code}}', verificationCode)
        .replace('{{timestamp}}', Date.now().toString());

      const verification = await this.client.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        subject: 'Verify Your Email Address',
        html,
      });

      if (!verification.error) {
        console.log('Verification email sent:', verification['data']);
      } else {
        console.error(
          'Error sending verification email:',
          verification['error'],
        );
      }
      return verification;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
}
