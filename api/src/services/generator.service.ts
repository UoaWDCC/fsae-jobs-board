import { BindingScope, injectable } from '@loopback/core';

@injectable({ scope: BindingScope.TRANSIENT })
export class GeneratorService {
    constructor() {}

    async generateCode(): Promise<string> {
        const chars = '0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }

    async generateToken(): Promise<string> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 64; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
}
