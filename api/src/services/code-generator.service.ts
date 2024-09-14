import { BindingScope, injectable } from '@loopback/core';

@injectable({ scope: BindingScope.TRANSIENT })
export class CodeGeneratorService {
    constructor() {}

    async generateCode(): Promise<string> {
        const chars = '0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }
}
