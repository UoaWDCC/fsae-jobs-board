import {BindingScope, injectable} from '@loopback/core';
import * as bcrypt from 'bcryptjs';

@injectable({scope: BindingScope.TRANSIENT})
export class PasswordHasherService {
  private readonly saltRounds = 10;
  constructor() {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /*
    * @param providedPass: string, password provided by user. Non hashed
    * @param storedHashedPass: string, hashed password
   */
  async comparePassword(providedPass: string, storedPass: string): Promise<boolean> {
    return await bcrypt.compare(providedPass, storedPass);
  }
}
