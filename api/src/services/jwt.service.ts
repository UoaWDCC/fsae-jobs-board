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
      "role": userProfile.role,
      "activated": userProfile.activated
    }
    console.log('JWT: Generating token for user profile:', tokenBody);

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
      console.log('AUTH: Token verification failed - no token provided');
      throw new HttpErrors.Unauthorized('Error verifying Token. Token cannot be null');
    }

    let decodedToken: any;
    try {
      decodedToken = verify(token, this.jwtSecret);
    } catch (error) {
      console.log(`AUTH: Token verification failed - ${error.message}`);
      throw new HttpErrors.Unauthorized(`Error verifying token: ${error.message}`);
    }

    const {id, role, activated} = decodedToken;

    if (!id || !role || !activated) {
      console.log('AUTH: Token verification failed - missing required fields in payload');
      throw new HttpErrors.Unauthorized('Token payload missing required fields');
    }

    const securityUserProfile: UserProfile = {
      [securityId]: id,
      id: id,
      //name: 'Test',
      role: role,
      activated: activated
    };

    return Promise.resolve(securityUserProfile);
  }
}
