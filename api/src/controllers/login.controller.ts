// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {get, HttpErrors, post, requestBody} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {loginParams, loginResponse} from './controller-types/login.controller.types';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdminRepository, AlumniRepository, MemberRepository, SponsorRepository} from '../repositories';
import {FsaeUser} from '../models';
import {JwtService, PasswordHasherService} from '../services';
import {UserProfile} from '@loopback/security';

export class LoginController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @inject('services.jwtservice') private jwtService: JwtService,
    @inject('services.passwordhasher') private passwordHasher: PasswordHasherService
  ) {}

  @post('/login-admin')
  async login(
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
    });

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
