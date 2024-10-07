import {injectable, BindingScope, inject} from '@loopback/core';
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

  // Note: UserProfile accepts any, bypasses restriction of SecurityIdentityUser. Not ideal.
  generateToken(userProfile: any): Promise<string> {
    if (!userProfile) {
      throw new Error('securityUserProfile cannot be null');
    }

    const tokenBody = {
      "id": userProfile.id,
      "role": userProfile.fsaeRole,
      "activated": userProfile.activated
    }

    const token = sign(
      tokenBody,
      this.jwtSecret,
      {
        expiresIn: '24h',
      }
    );

    return Promise.resolve(token);
  }

  // Verify token and map it to securityUserProfile
  verifyToken(token: string): Promise<any> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Error verifying Token. Token cannot be null');
    }

    let decodedToken: any;
    try {
      decodedToken = verify(token, this.jwtSecret);
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error verifying token: ${error.message}`);
    }

    const {id, role, activated} = decodedToken;

    if (!id || !role || !activated) {
      throw new HttpErrors.Unauthorized('Token payload missing required fields');
    }

    const securityUserProfile: UserProfile = {
      [securityId]: id,
      id: id,
      //name: 'Test',
      fsaeRole: role,
      activated: activated
    };

    return Promise.resolve(securityUserProfile);
  }
}
