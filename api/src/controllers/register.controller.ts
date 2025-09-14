// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import { repository } from '@loopback/repository';
import { AdminRepository, AlumniRepository, MemberRepository, SponsorRepository, VerificationRepository } from '../repositories';
import { HttpErrors, post, requestBody } from '@loopback/rest';
import { createFSAEUserDto } from './controller-types/register.controller.types';
import { Admin, FsaeRole } from '../models';
import { inject, service } from '@loopback/core';
import {FsaeUserService,  PasswordHasherService } from '../services';
import { BindingKeys } from '../constants/binding-keys';
import { TwilioService } from '../services/twilio.service';
import { GeneratorService } from '../services/generator.service';

export class RegisterController {
        constructor(
            @repository(AdminRepository) private adminRepository: AdminRepository,
            @repository(AlumniRepository) private alumniRepository: AlumniRepository,
            @repository(MemberRepository) private memberRepository: MemberRepository,
            @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
            @service(FsaeUserService) private fsaeUserService: FsaeUserService,
            @repository(VerificationRepository) private verificationRepository: VerificationRepository,
            @inject(BindingKeys.PASSWORD_HASHER) private passwordHasher: PasswordHasherService,
            @inject('services.generator') private generator: GeneratorService,
            @inject('services.twilioService') private twilioService: TwilioService
        ) { }

  @post('/register-admin')
  // Todo authorize only admin to register admin
  async registerAdmin(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
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
            role: FsaeRole.ADMIN,
            desc: createUserDto.desc
        });

        /* const { verification, verificationCode } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Administrator');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            verificationCode: verificationCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000*60*10,
            twilioId: verification.sid,
            role: FsaeRole.ADMIN,
            resentOnce: false
        }); //TODO: Restore verification*/ 

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
            required: ['email', 'password', 'firstName', 'lastName', 'phoneNumber'],
            properties: {
              email: {
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
        throw new HttpErrors.Conflict('Email already exists');
      }

      let hashedPassword = await this.passwordHasher.hashPassword(
        createUserDto.password,
      );

      let newMember = this.memberRepository.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        activated: true, // Default activate as all this HTTP body requires validation on required fields.
        verified: true, // TODO: restore verification
        role: FsaeRole.MEMBER,
        desc: createUserDto.desc,
      });

      /* const { verification, verificationCode } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Member');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            verificationCode: verificationCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000*60*10,
            twilioId: verification.sid,
            role: FsaeRole.MEMBER,
            resentOnce: false
        }); //TODO: Restore verification*/

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
            required: ['email', 'password', 'phoneNumber', 'company'],
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
              desc: {
                type: 'string',
              },
              company: {
                type: 'string',
              }
            },
          },
        },
      }
    })createUserDto: createFSAEUserDto): Promise<Admin> {
      // Prevent duplicate user by email
      if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
        throw new HttpErrors.Conflict('Email already exists');
      }

      let hashedPassword = await this.passwordHasher.hashPassword(
        createUserDto.password,
      );

      let newMember = this.sponsorRepository.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        activated: false,
        verified: true, // TODO: restore verification
        role: FsaeRole.SPONSOR,
        desc: createUserDto.desc,
      });

      /* const { verification, verificationCode } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Sppnsor');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            verificationCode: verificationCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000*60*10,
            twilioId: verification.sid,
            role: FsaeRole.SPONSOR,
            resentOnce: false
        }); //TODO: Restore verification*/

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
            required: ['email', 'username', 'password', 'firstName', 'lastName', 'phoneNumber', 'company'],
            properties: {
              email: {
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
              },
              company: {
                type: 'string',
              }
            },
          },
        },
      }
    })createUserDto: createFSAEUserDto): Promise<Admin> {
      // Prevent duplicate user by email
      if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
        throw new HttpErrors.Conflict('Email already exists');
      }

      let hashedPassword = await this.passwordHasher.hashPassword(
        createUserDto.password,
      );

      let newMember = this.alumniRepository.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        activated: false,
        verified: true, // TODO: restore verification
        role: FsaeRole.ALUMNI,
        desc: createUserDto.desc,
      });

      /*const { verification, verificationCode } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Alumni');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            verificationCode: verificationCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000*60*10,
            twilioId: verification.sid,
            role: FsaeRole.ALUMNI,
            resentOnce: false
        });//TODO: Restore verification*/

      return newMember;
    }

    async sendVerificationEmail(email: string, firstName: string) {
        var verificationCode = await this.generator.generateCode();
        var verification = await this.twilioService.sendVerificationEmail(email, firstName, verificationCode);
        return { verification, verificationCode };
    }
}

