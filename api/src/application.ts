import {ApplicationConfig} from '@loopback/core';
import {BootMixin} from '@loopback/boot';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'node:path';
import {MySequence} from './sequence';
import {JwtService, PasswordHasherService, GeneratorService, TwilioService} from './services';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {FSAEJwtStrategy} from './auth/auth-strategies/jwt-strategy';
import {
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationOptions,
  AuthorizationTags,
} from '@loopback/authorization';
import {FsaeAuthorizationProvider} from './auth/authorization/FsaeAuthorizationProvider';

export {ApplicationConfig};

export class FsaeApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    // Add the security scheme to the OpenAPI specification
    this.api({
      openapi: '3.0.0',
      info: {title: 'MyApp', version: '1.0.0'},
      paths: {},
      components: {
        securitySchemes: {
          // Define the security scheme (e.g., JWT bearer token)
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    });
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Authentication - JWT Service
    this.component(AuthenticationComponent);
    this.bind(`jwt.secret`).to(process.env.JWT_SECRET || 'fallback-secret-key')
    this.bind(`services.jwtservice`).toClass(JwtService);
    this.bind(`services.passwordhasher`).toClass(PasswordHasherService);
    this.bind('services.generator').toClass(GeneratorService);
    this.bind('services.twilioService').toClass(TwilioService);
    registerAuthenticationStrategy(this, FSAEJwtStrategy);

    // Authorization
    const authOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    const Authorizationbinding = this.component(AuthorizationComponent);
    this.configure(Authorizationbinding.key).to(authOptions);
    this
      .bind('authorizationProviders.fsae-authorization-provider')
      .toProvider(FsaeAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
