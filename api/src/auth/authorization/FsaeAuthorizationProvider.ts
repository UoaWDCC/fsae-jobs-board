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
    const clientRole = context.principals[0].role;
    const allowedRoles = metadata.allowedRoles;

    if (allowedRoles === undefined || allowedRoles.length === 0) {
      return AuthorizationDecision.DENY
    } else {
      return allowedRoles.includes(clientRole)
        ? AuthorizationDecision.ALLOW
        : AuthorizationDecision.DENY;
    }
  }
}
