// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {repository} from '@loopback/repository';
import {
  AdminRepository,
  AlumniRepository,
  MemberRepository,
  SponsorRepository,
  VerificationRepository,
} from '../repositories';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {getModelSchemaRef} from '@loopback/rest';
import {Admin, Alumni, FsaeRole, Member, Sponsor} from '../models';
import {inject, service} from '@loopback/core';
import {FsaeUserService, PasswordHasherService} from '../services';
import {BindingKeys} from '../constants/binding-keys';
import {ResendService} from '../services/resend.service';
import {GeneratorService} from '../services/generator.service';
import {
  CreateAdminDTO,
  CreateAlumniDTO,
  CreateMemberDTO,
  CreateSponsorDTO,
} from './controller-types/register.controller.types';

export class RegisterController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @service(FsaeUserService) private fsaeUserService: FsaeUserService,
    @repository(VerificationRepository)
    private verificationRepository: VerificationRepository,
    @inject(BindingKeys.PASSWORD_HASHER)
    private passwordHasher: PasswordHasherService,
    @inject('services.generator') private generator: GeneratorService,
    @inject('services.resendService') private resendService: ResendService,
  ) {}
  @post('/register-admin')
  // Todo authorize only admin to register admin
  async registerAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CreateAdminDTO),
        },
      },
    })
    createAdminDTO: CreateAdminDTO,
  ): Promise<Admin> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createAdminDTO.email)) {
      throw new HttpErrors.Conflict('Email already exists');
    }

    let hashedPassword = await this.passwordHasher.hashPassword(
      createAdminDTO.password,
    );

    let newAdmin = this.adminRepository.create({
      email: createAdminDTO.email,
      password: hashedPassword,
      role: FsaeRole.ADMIN,
      description: createAdminDTO.description,
      phoneNumber: createAdminDTO.phoneNumber,
      avatarURL: createAdminDTO.avatarURL,
      bannerURL: createAdminDTO.bannerURL,
      firstName: createAdminDTO.firstName,
      lastName: createAdminDTO.lastName,
    });

    await this.initiateVerification(
      createAdminDTO.email,
      createAdminDTO.firstName,
      FsaeRole.ADMIN,
    );

    return newAdmin;
  }

  @post('/register-member')
  async registerMember(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: getModelSchemaRef(CreateMemberDTO),
        },
      },
    })
    createMemberDTO: CreateMemberDTO,
  ): Promise<CreateMemberDTO> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createMemberDTO.email)) {
      throw new HttpErrors.Conflict('Email already exists');
    }
    let hashedPassword = await this.passwordHasher.hashPassword(
      createMemberDTO.password,
    );

    let newMember = await this.memberRepository.create({
      email: createMemberDTO.email,
      password: hashedPassword,
      role: FsaeRole.MEMBER,
      description: createMemberDTO.description,
      phoneNumber: createMemberDTO.phoneNumber,
      avatarURL: createMemberDTO.avatarURL,
      bannerURL: createMemberDTO.bannerURL,
      firstName: createMemberDTO.firstName,
      lastName: createMemberDTO.lastName,
      lookingFor: createMemberDTO.lookingFor,
      education: createMemberDTO.education,
      skills: createMemberDTO.skills,
    });

    await this.initiateVerification(
      createMemberDTO.email,
      createMemberDTO.firstName,
      FsaeRole.MEMBER,
    );

    return newMember;
  }

  @post('/register-sponsor')
  async registerSponsor(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: getModelSchemaRef(CreateSponsorDTO),
        },
      },
    })
    createSponsorDTO: CreateSponsorDTO,
  ): Promise<CreateSponsorDTO> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createSponsorDTO.email)) {
      throw new HttpErrors.Conflict('Email already exists');
    }
    let hashedPassword = await this.passwordHasher.hashPassword(
      createSponsorDTO.password,
    );

    let newMember = await this.sponsorRepository.create({
      email: createSponsorDTO.email,
      password: hashedPassword,
      role: FsaeRole.SPONSOR,
      description: createSponsorDTO.description,
      phoneNumber: createSponsorDTO.phoneNumber,
      avatarURL: createSponsorDTO.avatarURL,
      bannerURL: createSponsorDTO.bannerURL,
      companyName: createSponsorDTO.companyName,
      websiteURL: createSponsorDTO.websiteURL,
      industry: createSponsorDTO.industry,
    });

    await this.initiateVerification(
      createSponsorDTO.email,
      createSponsorDTO.companyName,
      FsaeRole.SPONSOR,
    );

    return newMember;
  }

  @post('/register-alumni')
  async registerAlumni(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: getModelSchemaRef(CreateAlumniDTO),
        },
      },
    })
    createAlumniDTO: CreateAlumniDTO,
  ): Promise<CreateAlumniDTO> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createAlumniDTO.email)) {
      throw new HttpErrors.Conflict('Email already exists');
    }
    let hashedPassword = await this.passwordHasher.hashPassword(
      createAlumniDTO.password,
    );

    let newAlumni = await this.alumniRepository.create({
      email: createAlumniDTO.email,
      password: hashedPassword,
      role: FsaeRole.ALUMNI,
      description: createAlumniDTO.description,
      phoneNumber: createAlumniDTO.phoneNumber,
      avatarURL: createAlumniDTO.avatarURL,
      bannerURL: createAlumniDTO.bannerURL,
      firstName: createAlumniDTO.firstName,
      lastName: createAlumniDTO.lastName,
      companyName: createAlumniDTO.companyName,
    });

    await this.initiateVerification(
      createAlumniDTO.email,
      createAlumniDTO.firstName,
      FsaeRole.ADMIN,
    );

    return newAlumni;
  }

  async initiateVerification(
    email: string,
    name: string,
    role: FsaeRole,
  ): Promise<void> {
    const {verification, verificationCode} = await this.sendVerificationEmail(
      email,
      name,
    );

    await this.verificationRepository.create({
      email: email,
      verificationCode: verificationCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 10,
      role,
      resentOnce: false,
    });
  }

  async sendVerificationEmail(email: string, firstName: string) {
    var verificationCode = await this.generator.generateCode();
    var verification = await this.resendService.sendVerificationEmail(
      email,
      firstName,
      verificationCode,
    );
    return {verification, verificationCode};
  }
}
