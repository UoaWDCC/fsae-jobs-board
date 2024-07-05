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
import {JwtService} from './services';
import {registerAuthenticationStrategy} from '@loopback/authentication';
import {FSAEJwtStrategy} from './auth/auth-strategies/jwt-strategy';

export {ApplicationConfig};

export class FsaeApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Authentication - JWT Service
    this.bind(`jwt.secret`).to(`9dI8a5D6CkP2Qb3jRx_VwJnGq_8OqbkO`) // TODO: Move to env variable
    this.bind(`services.jwtservice`).toClass(JwtService);
    registerAuthenticationStrategy(this, FSAEJwtStrategy);



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
