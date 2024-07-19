import {inject} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {FsaeRole} from '../models';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/protected-ping')
  // @response(200, PING_RESPONSE)
  @authenticate('fsae-jwt')
  protected_ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'This endpoint is protected by JWT',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/protected-ping/admin-only')
  // @response(200, PING_RESPONSE)
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN],
  })
  admin_only_protected_ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Admin only endpoint',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/protected-ping/sponsor-only')
  // @response(200, PING_RESPONSE)
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.SPONSOR],
  })
  sponsor_only_protected_ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Sponsor only endpoint',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/protected-ping/allow-inactive-accounts')
  // @response(200, PING_RESPONSE)
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.SPONSOR, FsaeRole.ALUMNI, FsaeRole.ALUMNI],
    scopes: ['allow-non-activated'],
  })
  allow_non_activated_accounts(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'This endpoint allows non activated accounts. ',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }


}
