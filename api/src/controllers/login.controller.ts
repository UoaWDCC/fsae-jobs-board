// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {get, HttpErrors, param, post, Request, requestBody, RestBindings} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {loginParams, loginResponse} from './controller-types/login.controller.types';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdminRepository, AlumniRepository, MemberRepository, SponsorRepository} from '../repositories';
import {FsaeRole, FsaeUser} from '../models';
import {FsaeUserService, JwtService, PasswordHasherService} from '../services';
import {UserProfile} from '@loopback/security';
import {authorize} from '@loopback/authorization';

export class LoginController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @service(FsaeUserService) private fsaeUserService: FsaeUserService,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('services.jwtservice') private jwtService: JwtService,
    @inject('services.passwordhasher') private passwordHasher: PasswordHasherService
  ) {}

  @post('/login-admin')
  async loginAdmin(
    @requestBody({
    description: 'The input of login function',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            }
          },
        },
      },
    }
  })credentials: loginParams): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = await this.adminRepository.find({
      where: {
        email: credentials.email,
      },
    }) as FsaeUser[];

    return this.getUserToken(credentials, userSearchResults);
  }

  @post('/login-sponsor')
  async loginSponsor(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              }
            },
          },
        },
      }
    })credentials: loginParams): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = await this.sponsorRepository.find({
      where: {
        email: credentials.email,
      },
    }) as FsaeUser[];

    return this.getUserToken(credentials, userSearchResults);
  }

  @post('/login-member')
  async loginMember(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              }
            },
          },
        },
      }
    })credentials: loginParams): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = await this.memberRepository.find({
      where: {
        email: credentials.email,
      },
    }) as FsaeUser[];

    return this.getUserToken(credentials, userSearchResults);
  }

  @post('/login-alumni')
  async loginAlumni(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              }
            },
          },
        },
      }
    })credentials: loginParams): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = await this.alumniRepository.find({
      where: {
        email: credentials.email,
      },
    }) as FsaeUser[];

    return this.getUserToken(credentials, userSearchResults);
  }

  @get('/user/{userEmail}/role')
  async getUserRole(
    @param.path.string('userEmail') userEmail: string
  ) : Promise<string | null> {
    return this.fsaeUserService.getUserRole(userEmail);
  }

  @get('/user/whoami')
  // @response(200, PING_RESPONSE)
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.SPONSOR, FsaeRole.ALUMNI, FsaeRole.ALUMNI],
    scopes: ['allow-non-activated'],
  })
  whoAmI(): object {
    throw Error("todo")
    // Todo: Requires usage of UserRepo which is on another ticket.
    // // Reply with a greeting, the current time, the url, and request headers
    // return {
    //   greeting: 'This endpoint allows non activated accounts. ',
    //   date: new Date(),
    //   url: this.req.url,
    //   headers: Object.assign({}, this.req.headers),
    // };
  }

  async getUserToken(credentials: loginParams, userSearchResults: FsaeUser[]) : Promise<loginResponse> {
    // If no user found, invalid credientials
    if (userSearchResults.length === 0) {
      throw new HttpErrors.Unauthorized('Invalid login credentials');
    } else if (userSearchResults.length > 1) {
      throw new HttpErrors.Unauthorized('Multiple users found with same email');
    }

    let fsaeUser = userSearchResults[0];

    // Verify Credentials
    let passwordsMatched = await this.passwordHasher.comparePassword(credentials.password, fsaeUser.password);
    if (!passwordsMatched) {
      throw new HttpErrors.Unauthorized('Invalid login credentials');
    }

    // Return Jwt Token
    let token = await this.jwtService.generateToken(fsaeUser)
    return {
      userId: fsaeUser.id as string,
      token: token,
    }
  }
}
