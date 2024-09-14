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

    async sendVerificationEmail(email: string, firstName: string, verification_code: string) {
        if (!this.verificationServiceId) {
            throw new Error('Verification Service ID is not defined');
        }

        const verification = await this.client.verify.v2.services(this.verificationServiceId).verifications.create({
            to: email,
            channel: 'email',
            channelConfiguration: {
                substitutions: {
                    first_name: firstName,
                    verification_code: verification_code,
                }
            }
        });

        return verification;
    }

    async verifyUser(verificationId: string) {
        const verification = await this.client.verify.v2.services(this.verificationServiceId).verifications(verificationId).update({ status: "approved" });
        return verification;
    }
}