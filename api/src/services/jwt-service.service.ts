import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';

@injectable({scope: BindingScope.SINGLETON})
class JwtServiceService implements TokenService{
  constructor(/* Add @inject to inject parameters */) {}

  generateToken(securityUserProfile: UserProfile): Promise<string> {
    return Promise.resolve('');
  }

  verifyToken(token: string): Promise<UserProfile> {
    throw new Error('Method not implemented.');
    // return Promise.resolve(undefined);
  }

}
