import { BindingScope, injectable } from '@loopback/core';

@injectable({ scope: BindingScope.TRANSIENT })
export class TokenService {
    constructor() {}

    async generateToken(): Promise<string> {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for (let i = 0; i < 256; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
}
