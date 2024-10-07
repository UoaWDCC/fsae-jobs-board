import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {inject} from '@loopback/core';
import {JwtService} from '../../services';
import { BindingKeys } from '../../constants/binding-keys';

export class FSAEJwtStrategy implements AuthenticationStrategy {
  name = 'fsae-jwt';

  constructor(
    @inject(BindingKeys.JWT_SERVICE) public JwtService: JwtService
  ) {}

  authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined> {
    const token = this.extractTokenFromRequest(request);
    const securityUserProfile = this.JwtService.verifyToken(token);
    return Promise.resolve(securityUserProfile);
  }

  private extractTokenFromRequest(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized("Authorization header not found")
    }

    const authHeaderValue = request.headers.authorization;

    if(!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization header is not of type Bearer. "Bearer <<Token>>"');
    }

    const parts = authHeaderValue.split(' '); // Splits 'Bearer <Token>'
    if (parts.length !== 2) {
      throw new HttpErrors.BadRequest('Authorization header value has too many parts. It must follow the pattern: \'Bearer xx.yy.zz\' where xx.yy.zz is a valid JWT token.');
    }
    const token = parts[1];
    return token;
  }
}
