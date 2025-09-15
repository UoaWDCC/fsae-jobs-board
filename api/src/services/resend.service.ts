import fs from 'fs';
import {Resend} from 'resend';
import {BindingScope, injectable} from '@loopback/core';
import {
  EMAIL_VERIFICATION_TEMPLATE_PATH,
  PASSWORD_RESET_TEMPLATE_PATH,
  SENDER_EMAIL,
} from '../constants/email-constants.ts';

@injectable({scope: BindingScope.TRANSIENT})
export class ResendService {
  private client: Resend;
  private emailVerificationTemplate: string;
  private passwordResetTemplate: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    this.client = new Resend(apiKey);
    this.emailVerificationTemplate = fs.readFileSync(
      EMAIL_VERIFICATION_TEMPLATE_PATH,
      'utf8',
    );
    this.passwordResetTemplate = fs.readFileSync(
      PASSWORD_RESET_TEMPLATE_PATH,
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

      if (!this.emailVerificationTemplate) {
        throw new Error('Email template not loaded');
      }

      const html = this.emailVerificationTemplate
        .replace('{{first_name}}', firstName)
        .replace('{{verification_code}}', verificationCode)
        .replace('{{timestamp}}', Date.now().toString());

      const verification = await this.client.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        subject: 'Verify Your Email Address',
        html,
      });

      if (verification.error) {
        console.error('Error sending verification email:', verification.error);
        throw new Error(
          verification.error.message || 'Failed to send verification email',
        );
      }

      console.log('Verification email sent:', verification.data);
      return verification.data; // return only data if success
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetLink: string,
  ) {
    try {
      if (!this.client) {
        throw new Error('Resend client not initialized');
      }

      if (!this.passwordResetTemplate) {
        throw new Error('Email template not loaded');
      }

      const html = this.passwordResetTemplate
        .replace('{{first_name}}', firstName)
        .replace('{{reset_link}}', resetLink)
        .replace('{{timestamp}}', Date.now().toString());

      const passwordReset = await this.client.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        subject: 'Reset Your Password',
        html,
      });

      if (!passwordReset.error) {
        console.log('Password reset email sent:', passwordReset['data']);
      } else {
        console.error(
          'Error sending password reset email:',
          passwordReset['error'],
        );
      }
      return passwordReset;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}
