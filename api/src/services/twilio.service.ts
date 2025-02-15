import twilio from 'twilio';
import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class TwilioService {
    private client: twilio.Twilio;
    private accountSid: string;
    private authToken: string;
    private verificationServiceId: string;

    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
        this.verificationServiceId = process.env.TWILIO_VERIFY_SERVICE_ID || '';
        this.client = twilio(this.accountSid, this.authToken);
    }

    async sendVerificationEmail(email: string, firstName: string, verificationCode: string) {
        if (!this.verificationServiceId) {
            throw new Error('Verification Service ID is not defined');
        }

        const verification = await this.client.verify.v2.services(this.verificationServiceId).verifications.create({
            to: email,
            channel: 'email',
            channelConfiguration: {
                template_id: "d-4b7a924efdfb492d97ce2f317e3968f7",
                substitutions: {
                    first_name: firstName,
                    verification_code: verificationCode,
                }
            }
        });

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
                template_id: "d-4f7d51e155b8429da523fc36ddf22f14",
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