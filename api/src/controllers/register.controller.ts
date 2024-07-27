// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {repository} from '@loopback/repository';
import {AdminRepository, AlumniRepository, MemberRepository, SponsorRepository} from '../repositories';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {createFSAEUserDto} from './controller-types/register.controller.types';
import {Admin, FsaeRole} from '../models';
import {inject, service} from '@loopback/core';
import {FsaeUserService, PasswordHasherService} from '../services';

export class RegisterController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @service(FsaeUserService) private fsaeUserService: FsaeUserService,
    @inject('services.passwordhasher') private passwordHasher: PasswordHasherService
  ) {}

  @post('/register-admin')
  // Todo authorize only admin to register admin
  async registerAdmin(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'username', 'password'],
            properties: {
              email: {
                type: 'string',
              },
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
              desc: {
                type: 'string',
              }
            },
          },
        },
      }
    })createUserDto: createFSAEUserDto): Promise<Admin> {
      // Prevent duplicate user by email
      if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
        throw new HttpErrors.Conflict('Email already exists')
      }

      let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

      let newAdmin = this.adminRepository.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        activated: true,
        fsaeRole: FsaeRole.ADMIN,
        desc: createUserDto.desc
      });

      return newAdmin;
  }

  @post('/register-member')
  async registerMember(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'username', 'password', 'firstName', 'lastName', 'phoneNumber'],
            properties: {
              email: {
                type: 'string',
              },
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
              desc: {
                type: 'string',
              }
            },
          },
        },
      }
    })createUserDto: createFSAEUserDto): Promise<Admin> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
      throw new HttpErrors.Conflict('Email already exists')
    }

    let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

    let newMember = this.memberRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneNumber: createUserDto.phoneNumber,
      activated: true, // Default activate as all this HTTP body requires validation on required fields.
      fsaeRole: FsaeRole.MEMBER,
      desc: createUserDto.desc
    });

    return newMember;
  }

  @post('/register-sponsor')
  async registerSponsor(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'username', 'password', 'firstName', 'lastName', 'phoneNumber'],
            properties: {
              email: {
                type: 'string',
              },
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
              desc: {
                type: 'string',
              }
            },
          },
        },
      }
    })createUserDto: createFSAEUserDto): Promise<Admin> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
      throw new HttpErrors.Conflict('Email already exists')
    }

    let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

    let newMember = this.sponsorRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneNumber: createUserDto.phoneNumber,
      activated: false,
      fsaeRole: FsaeRole.SPONSOR,
      desc: createUserDto.desc
    });

    return newMember;
  }

  @post('/register-alumni')
  async registerAlumni(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'username', 'password', 'firstName', 'lastName', 'phoneNumber'],
            properties: {
              email: {
                type: 'string',
              },
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
              desc: {
                type: 'string',
              }
            },
          },
        },
      }
    })createUserDto: createFSAEUserDto): Promise<Admin> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
      throw new HttpErrors.Conflict('Email already exists')
    }

    let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

    let newMember = this.alumniRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneNumber: createUserDto.phoneNumber,
      activated: false,
      fsaeRole: FsaeRole.ALUMNI,
      desc: createUserDto.desc
    });

    return newMember;
  }


}
