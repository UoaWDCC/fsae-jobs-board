// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import { repository } from '@loopback/repository';
import { AdminRepository, AlumniRepository, MemberRepository, SponsorRepository, VerificationRepository } from '../repositories';
import { HttpErrors, post, requestBody } from '@loopback/rest';
import { getModelSchemaRef } from '@loopback/rest';
import { Admin, Alumni, FsaeRole, Member, Sponsor } from '../models';
import { inject, service } from '@loopback/core';
import { FsaeUserService,  PasswordHasherService } from '../services';
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
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {exclude: ['id', 'activated', 'verified', 'adminStatus', 'role', 'createdAt']}),
        },
      },
    })createUserDto: Admin): Promise<Admin> {
      // Prevent duplicate user by email
      if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
        throw new HttpErrors.Conflict('Email already exists')
      }

      let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

      let newAdmin = this.adminRepository.create({
          email: createUserDto.email,
          password: hashedPassword,
          role: FsaeRole.ADMIN,
          description: createUserDto.description,
          phoneNumber: createUserDto.phoneNumber,
          avatarURL: createUserDto.avatarURL,
          bannerURL: createUserDto.bannerURL,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
      });

      await this.initiateVerification(createUserDto.email, createUserDto.firstName)

      return newAdmin;
    }

  @post('/register-member')
  async registerMember(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {exclude: [
            'id', 'activated', 'verified', 'adminStatus', 'role', 'createdAt', 'cvData', 'cvFileName', 'cvMimeType', 'cvSize', 'cvUploadedAt', 'hasCV'
          ]})
        },
      }
    })createUserDto: Member): Promise<Member> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
      throw new HttpErrors.Conflict('Email already exists')
    }
      let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

      let newMember = this.memberRepository.create({
          email: createUserDto.email,
          password: hashedPassword,
          role: FsaeRole.MEMBER,
          description: createUserDto.description,
          phoneNumber: createUserDto.phoneNumber,
          avatarURL: createUserDto.avatarURL,
          bannerURL: createUserDto.bannerURL,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          lookingFor: createUserDto.lookingFor,
          education: createUserDto.education,
          skills: createUserDto.skills
      });

      await this.initiateVerification(createUserDto.email, createUserDto.firstName)

      return newMember;
    }

  @post('/register-sponsor')
  async registerSponsor(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sponsor, {exclude: ['id', 'activated', 'verified', 'adminStatus', 'role', 'createdAt']})
        },
      }
    })createUserDto: Sponsor): Promise<Sponsor> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
      throw new HttpErrors.Conflict('Email already exists')
    }
      let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

      let newMember = this.sponsorRepository.create({
          email: createUserDto.email,
          password: hashedPassword,
          role: FsaeRole.SPONSOR,
          description: createUserDto.description,
          phoneNumber: createUserDto.phoneNumber,
          avatarURL: createUserDto.avatarURL,
          bannerURL: createUserDto.bannerURL,
          companyName: createUserDto.companyName,
          websiteURL: createUserDto.websiteURL,
          industry: createUserDto.industry
      });

      await this.initiateVerification(createUserDto.email, createUserDto.companyName)

      return newMember;
    }

  @post('/register-alumni')
  async registerAlumni(
    @requestBody({
      description: 'The input of register function',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alumni, {exclude: ['id', 'activated', 'verified', 'adminStatus', 'role', 'createdAt']})
        },
      }
    })createUserDto: Alumni): Promise<Alumni> {
    // Prevent duplicate user by email
    if (await this.fsaeUserService.doesUserExist(createUserDto.email)) {
      throw new HttpErrors.Conflict('Email already exists')
    }
      let hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password);

      let newAlumni = this.alumniRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
        role: FsaeRole.SPONSOR,
        description: createUserDto.description,
        phoneNumber: createUserDto.phoneNumber,
        avatarURL: createUserDto.avatarURL,
        bannerURL: createUserDto.bannerURL,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        companyName: createUserDto.companyName
      });
      
      await this.initiateVerification(createUserDto.email, createUserDto.firstName)

      return newAlumni;
    }

    async initiateVerification(email: string, name: string): Promise<void> {
      const { verification, verificationCode } = await this.sendVerificationEmail(email, name);
        
      await this.verificationRepository.create({
        email: email,
        verificationCode: verificationCode,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000*60*10,
        twilioId: verification.sid,
        fsaeRole: FsaeRole.ADMIN,
        resentOnce: false
      });
    }

    async sendVerificationEmail(email: string, firstName: string) {
        var verificationCode = await this.generator.generateCode();
        var verification = await this.twilioService.sendVerificationEmail(email, firstName, verificationCode);
        return { verification, verificationCode };
    }
}

