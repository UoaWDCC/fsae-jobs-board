import twilio from 'twilio';
import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class TwilioService {
    private client: twilio.Twilio;
    private accountSid: string;
    private authToken: string;
    private verificationServiceId: string;
    private verificationTemplateId: string;
    private passwordResetTemplateId: string;

    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
        this.verificationServiceId = process.env.TWILIO_VERIFY_SERVICE_ID || '';
        this.verificationTemplateId = process.env.TWILIO_VERIFICATION_TEMPLATE_ID || '';
        this.passwordResetTemplateId = process.env.TWILIO_PASSWORD_RESET_TEMPLATE_ID || '';
        this.client = twilio(this.accountSid, this.authToken);
    }

    async sendVerificationEmail(email: string, firstName: string, verificationCode: string) {
        if (!this.verificationServiceId) {
            throw new Error('Verification Service ID is not defined');
        }

        const verification = await this.client.verify.v2
          .services(this.verificationServiceId)
          .verifications.create({
            to: email,
            channel: 'email',
            channelConfiguration: {
              template_id: this.verificationTemplateId,
              substitutions: {
                first_name: firstName,
                verification_code: verificationCode,
              },
            },
          })
          .catch(error => {
            console.error(
              'Twilio API Error Details:',
              error.message,
              error.moreInfo,
            );
            throw new Error(`Verification email failed: ${error.message}`);
          });

        console.log('Verification email sent:', verification);
        console.log('Verification code:', verificationCode);
        return verification;
    }

    async sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
        if (!this.verificationServiceId) {
            throw new Error('Verification Service ID is not defined');
        }

        const passwordReset = await this.client.verify.v2.services(this.verificationServiceId).verifications.create({
            to: email,
            channel: 'email',
            channelConfiguration: {
                template_id: this.passwordResetTemplateId,
                substitutions: {
                    first_name: firstName,
                    reset_token: resetToken,
                }
            }
        });

        return passwordReset;
    }

    async verifyUser(verificationId: string) {
        const verification = await this.client.verify.v2.services(this.verificationServiceId).verifications(verificationId).update({ status: "approved" });
        return verification;
    }
}