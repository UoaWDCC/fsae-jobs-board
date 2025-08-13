// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {
  get,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {
  loginParams,
  loginResponse,
  whoAmIResponse,
} from './controller-types/login.controller.types';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AdminRepository,
  AlumniRepository,
  MemberRepository,
  SponsorRepository,
} from '../repositories';
import {FsaeRole, FsaeUser} from '../models';
import {FsaeUserService, JwtService, PasswordHasherService} from '../services';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authorize} from '@loopback/authorization';
import {BindingKeys} from '../constants/binding-keys';

export class LoginController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @service(FsaeUserService) private fsaeUserService: FsaeUserService,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(BindingKeys.JWT_SERVICE) private jwtService: JwtService,
    @inject(BindingKeys.PASSWORD_HASHER)
    private passwordHasher: PasswordHasherService,
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
              },
            },
          },
        },
      },
    })
    credentials: loginParams,
  ): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = (await this.adminRepository.find({
      where: {
        email: credentials.email,
      },
    })) as FsaeUser[];

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
              },
            },
          },
        },
      },
    })
    credentials: loginParams,
  ): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = (await this.sponsorRepository.find({
      where: {
        email: credentials.email,
      },
    })) as FsaeUser[];

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
              },
            },
          },
        },
      },
    })
    credentials: loginParams,
  ): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = (await this.memberRepository.find({
      where: {
        email: credentials.email,
      },
    })) as FsaeUser[];

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
              },
            },
          },
        },
      },
    })
    credentials: loginParams,
  ): Promise<loginResponse> {
    // Find user Profile
    let userSearchResults = (await this.alumniRepository.find({
      where: {
        email: credentials.email,
      },
    })) as FsaeUser[];

    return this.getUserToken(credentials, userSearchResults);
  }

  @get('/user/{userEmail}/role')
  async getUserRole(
    @param.path.string('userEmail') userEmail: string,
  ): Promise<string | null> {
    return this.fsaeUserService.getUserRole(userEmail);
  }

  @get('/user/whoami')
  @authenticate('fsae-jwt')
  @authorize({
    allowedRoles: [
      FsaeRole.ADMIN,
      FsaeRole.SPONSOR,
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
    ],
    scopes: ['allow-non-activated'],
  })
  @response(200, {
    description: 'Authenticated user details',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            email: {type: 'string'},
            role: {type: 'string'},
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<whoAmIResponse> {
    const userId = currentUser.id;
    const role = currentUser.fsaeRole;

    let user;
    switch (role) {
      case FsaeRole.ADMIN:
        user = await this.adminRepository.findById(userId);
        break;
      case FsaeRole.SPONSOR:
        user = await this.sponsorRepository.findById(userId);
        break;
      case FsaeRole.ALUMNI:
        user = await this.alumniRepository.findById(userId);
        break;
      case FsaeRole.MEMBER:
        user = await this.memberRepository.findById(userId);
        break;
      default:
        throw new HttpErrors.InternalServerError('Unrecognized role');
    }

    return {
      id: user.id,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email,
      role: role,
    };
  }

  async getUserToken(
    credentials: loginParams,
    userSearchResults: FsaeUser[],
  ): Promise<loginResponse> {
    // If no user found, invalid credientials
    if (userSearchResults.length === 0) {
      throw new HttpErrors.Unauthorized('Invalid login credentials');
    } else if (userSearchResults.length > 1) {
      throw new HttpErrors.Unauthorized('Multiple users found with same email');
    }

    let fsaeUser = userSearchResults[0];
    
    // Verify Credentials
    let passwordsMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      fsaeUser.password,
    );
    if (!passwordsMatched) {
      throw new HttpErrors.Unauthorized('Invalid login credentials');
    }

    // Check for missing required fields based on role
    let hasMissingInfo = false;
    const role = fsaeUser.role;
    
    // Define required fields for each role (check for both missing and empty strings)
    if (role === FsaeRole.MEMBER) {  
      hasMissingInfo = !fsaeUser.firstName || fsaeUser.firstName === '' ||
                       !fsaeUser.lastName || fsaeUser.lastName === '' ||
                       !fsaeUser.phoneNumber || fsaeUser.phoneNumber === '';
                       
    } else if (role === FsaeRole.ALUMNI) {
      hasMissingInfo = !fsaeUser.firstName || fsaeUser.firstName === '' ||
                       !fsaeUser.lastName || fsaeUser.lastName === '' ||
                       !fsaeUser.phoneNumber || fsaeUser.phoneNumber === '' ||
                       !fsaeUser.company || fsaeUser.company === '';
    } else if (role === FsaeRole.SPONSOR) {
      hasMissingInfo = !fsaeUser.company || fsaeUser.company === '' ||
                       !fsaeUser.name || fsaeUser.name === '' ||
                       !fsaeUser.phoneNumber || fsaeUser.phoneNumber === '';
    }

    // Return Jwt Token
    let token = await this.jwtService.generateToken(fsaeUser);
    return {
      userId: fsaeUser.id as string,
      token: token,
      verified: fsaeUser.verified,
      hasMissingInfo: hasMissingInfo,
    };
  }
}
