// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import { repository } from '@loopback/repository';
import { AdminRepository, AlumniRepository, MemberRepository, SponsorRepository, VerificationRepository } from '../repositories';
import { HttpErrors, post, requestBody } from '@loopback/rest';
import { createFSAEUserDto } from './controller-types/register.controller.types';
import { Admin, FsaeRole } from '../models';
import { inject } from '@loopback/core';
import { PasswordHasherService } from '../services';
import { TwilioService } from '../services/twilio.service';
import { TokenService } from '../services/token.service';

export class RegisterController {
    constructor(
        @repository(AdminRepository) private adminRepository: AdminRepository,
        @repository(AlumniRepository) private alumniRepository: AlumniRepository,
        @repository(MemberRepository) private memberRepository: MemberRepository,
        @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
        @repository(VerificationRepository) private verificationRepository: VerificationRepository,
        @inject('services.passwordhasher') private passwordHasher: PasswordHasherService,
        @inject('services.tokenService') private tokenService: TokenService,
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
        }) createUserDto: createFSAEUserDto): Promise<Admin> {
        // Find user Profile
        let userSearchResults = await this.adminRepository.find({
            where: {
                email: createUserDto.email,
            },
        });

        // If no user found, invalid credientials
        if (userSearchResults.length > 0) {
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

        const { verification, token } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Administrator');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            token: token,
            twilioId: verification.sid,
            fsaeRole: FsaeRole.ADMIN
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
        }) createUserDto: createFSAEUserDto): Promise<Admin> {
        // Find user Profile
        let userSearchResults = await this.memberRepository.find({
            where: {
                email: createUserDto.email,
            },
        });

        // If no user found, invalid credientials
        if (userSearchResults.length > 0) {
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
            verified: false,
            fsaeRole: FsaeRole.MEMBER,
            desc: createUserDto.desc
        });

        const { verification, token } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Member');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            token: token,
            twilioId: verification.sid,
            fsaeRole: FsaeRole.MEMBER
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
        }) createUserDto: createFSAEUserDto): Promise<Admin> {
        // Find user Profile
        let userSearchResults = await this.sponsorRepository.find({
            where: {
                email: createUserDto.email,
            },
        });

        // If no user found, invalid credientials
        if (userSearchResults.length > 0) {
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
            verified: false,
            fsaeRole: FsaeRole.SPONSOR,
            desc: createUserDto.desc
        });

        const { verification, token } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Sponsor');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            token: token,
            twilioId: verification.sid,
            fsaeRole: FsaeRole.SPONSOR
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
        }) createUserDto: createFSAEUserDto): Promise<Admin> {
        // Find user Profile
        let userSearchResults = await this.alumniRepository.find({
            where: {
                email: createUserDto.email,
            },
        });

        // If no user found, invalid credientials
        if (userSearchResults.length > 0) {
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
            verified: false,
            fsaeRole: FsaeRole.ALUMNI,
            desc: createUserDto.desc
        });

        const { verification, token } = await this.sendVerificationEmail(createUserDto.email, createUserDto.firstName ? createUserDto.firstName : 'Alumni');
        
        await this.verificationRepository.create({
            email: createUserDto.email,
            token: token,
            twilioId: verification.sid,
            fsaeRole: FsaeRole.ALUMNI
        });

        return newMember;
    }

    async sendVerificationEmail(email: string, firstName: string) {
        var token = await this.tokenService.generateToken();
        var verification = await this.twilioService.sendVerificationEmail(email, firstName, token);
        return { verification, token };
    }
}
