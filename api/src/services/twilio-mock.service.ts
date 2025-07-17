import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class TwilioMockService {
    constructor() {
        console.log('Using MOCK Twilio Service for testing');
    }

    async sendVerificationEmail(email: string, firstName: string, verificationCode: string) {
        console.log(`MOCK: Sending verification email to ${email} with code ${verificationCode}`);
        
        // Simulate successful verification creation
        // Return a mock verification object that matches Twilio's response structure
        return {
            sid: `mock_verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            to: email,
            channel: 'email',
            created: new Date().toISOString()
        };
    }

    async sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
        console.log(`MOCK: Sending password reset email to ${email} with token ${resetToken}`);
        
        // Simulate successful password reset email
        return {
            sid: `mock_password_reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            to: email,
            channel: 'email',
            created: new Date().toISOString()
        };
    }

    async verifyUser(verificationId: string) {
        console.log(`MOCK: Marking verification ${verificationId} as approved`);
        
        // Simulate successful verification approval
        return {
            sid: verificationId,
            status: 'approved',
            updated: new Date().toISOString()
        };
    }
}