import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdminRepository, AlumniRepository, MemberRepository, SponsorRepository} from '../repositories';
import {FsaeRole} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class FsaeUserService {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
  ) {}

  async doesUserExist(email: string): Promise<boolean> {
    // This is required as cannot create repo for FsaeUser as its an abstract class
    const adminUser = await this.adminRepository.findOne({where: {email}});
    const alumniUser = await this.alumniRepository.findOne({where: {email}});
    const memberUser = await this.memberRepository.findOne({where: {email}});
    const sponsorUser = await this.sponsorRepository.findOne({where: {email}});
    return adminUser || alumniUser || memberUser || sponsorUser ? true : false;
  }

  async getUserRole(email: string) : Promise<FsaeRole | null> {
    var user;

    user = await this.adminRepository.findOne({where: {email}});
    if (user) return FsaeRole.ADMIN;

    user = await this.alumniRepository.findOne({where: {email}});
    if (user) return FsaeRole.ALUMNI;

    user = await this.memberRepository.findOne({where: {email}});
    if (user) return FsaeRole.MEMBER;

    user = await this.sponsorRepository.findOne({where: {email}});
    if (user) return FsaeRole.SPONSOR;

    return null;
  }
}
