import {Provider, ValueOrPromise} from '@loopback/core';
import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';

export class FsaeAuthorizationProvider implements Provider<Authorizer> {
  constructor() {}

  value(): ValueOrPromise<Authorizer> {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const userProfile = context.principals[0]
    console.log('AUTH: User profile:', userProfile);

    // Check if user profile exists
    if (!userProfile) {
      console.log('AUTH: Authorization failed - no user profile found');
      return AuthorizationDecision.DENY;
    }

    // Only allow activated users unless scope includes 'allow-non-activated'
    if (!userProfile.activated) {
      if (!metadata.scopes || !metadata.scopes.includes('allow-non-activated')) {
        console.log('AUTH: Authorization failed - user not activated');
        return AuthorizationDecision.DENY;
      }
    }

    // Check if role allowed
    const clientRole = userProfile.role;
    const allowedRoles = metadata.allowedRoles;
    if (allowedRoles === undefined || allowedRoles.length === 0) {
      console.log('AUTH: Authorization failed - no allowed roles specified');
      return AuthorizationDecision.DENY;
    }
    
    if (!clientRole) {
      console.log('AUTH: Authorization failed - user role not found');
      return AuthorizationDecision.DENY;
    }
    
    const isAllowed = allowedRoles.includes(clientRole);
    console.log(`AUTH: Role check - User role: ${clientRole}, Allowed roles: ${allowedRoles}, Access: ${isAllowed ? 'GRANTED' : 'DENIED'}`);
    
    return isAllowed
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
