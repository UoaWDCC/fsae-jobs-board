import {Resend} from 'resend';
import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class ResendService {
  private client: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    this.client = new Resend(apiKey);
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationCode: string,
  ) {
    const verification = await this.client.emails
      .send({
        from: 'delivered@resend.dev',
        to: [email],
        subject: 'Verify your email',
        html: `<strong>IT WORKS! ${firstName} ${verificationCode}</strong>`,
      })
      .catch(error => {
        console.error('Resend API Error Details:', error.message, error);
        throw new Error(`Verification email failed: ${error.message}`);
      });
    return verification;
  }
}
