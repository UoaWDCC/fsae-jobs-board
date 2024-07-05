import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {promisify} from 'util';
import {sign, verify} from 'jsonwebtoken';
import {HttpErrors} from '@loopback/rest';


@injectable({scope: BindingScope.SINGLETON})
export class JwtService implements TokenService{
  constructor(
    @inject('jwt.secret') private jwtSecret: string
  ) {}

  generateToken(securityUserProfile: UserProfile): Promise<string> {
    if (!securityUserProfile) {
      throw new Error('securityUserProfile cannot be null');
    }

    const token = sign(
      securityUserProfile,
      this.jwtSecret,
      {
        expiresIn: '24h',
      }
    );

    return Promise.resolve(token);
  }

  verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new Error('Error verifying Token. Token cannot be null');
    }

    let securityUserProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = verify(token, this.jwtSecret);
      // don't copy over token field 'iat' and 'exp', nor 'aud', 'iss', 'sub'

      // TODO: Correctly map out decoded Token to user profile
      securityUserProfile = {
        [securityId]: '',
        name: 'Test',
      };

    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error verifying token: ${error.message}`);
    }

    return Promise.resolve(securityUserProfile);
  }

}
