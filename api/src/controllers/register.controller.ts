// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {repository} from '@loopback/repository';
import {AdminRepository, AlumniRepository, MemberRepository, SponsorRepository} from '../repositories';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {createFSAEUserDto} from './controller-types/register.controller.types';
import {Admin, FsaeRole} from '../models';

export class RegisterController {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
  ) {}

  @post('/register-admin')
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

      let newAdmin = this.adminRepository.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        activated: true,
        fsaeRole: FsaeRole.ADMIN,
        desc: createUserDto.desc
      });

      return newAdmin;
  }
}
