import {
    repository,
} from '@loopback/repository';
import {get} from '@loopback/rest';
import {ObjectId} from 'mongodb';
import {AdminReview} from './controller-types/admin.controller.types';
import { FsaeRole, FsaeUser } from '../models';
import {
    MemberRepository,
    AlumniRepository,
    SponsorRepository,
    AdminRepository,
} from '../repositories';

export class AdminController {
    constructor(
        @repository(AdminRepository) private adminRepository: AdminRepository,
        @repository(AlumniRepository) private alumniRepository: AlumniRepository,
        @repository(MemberRepository) private memberRepository: MemberRepository,
        @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    ) { }

   @get('/user/admin/dashboard')
    async getAllUsers(): Promise<AdminReview[]> {
    const [alumni, members, sponsors] = await Promise.all([
        this.alumniRepository.find(),
        this.memberRepository.find(),
        this.sponsorRepository.find(),
    ]);

    const toReview = (u: FsaeUser, role: FsaeRole): AdminReview => {
        const id = (u._id ?? u.id).toString();

        const name =
        u.lastName && u.lastName !== '-' ? `${u.firstName} ${u.lastName}` : u.firstName;

        const created =
        u.createdAt ?? new Date(parseInt(id.substring(0, 8), 16) * 1000);

        return {
        id,
        name,
        role,
        date: created,
        status: u.adminStatus ?? 'pending',
        };
    };

    return [
        ...alumni.map(u   => toReview(u, FsaeRole.ALUMNI)),
        ...members.map(u  => toReview(u, FsaeRole.MEMBER)),
        ...sponsors.map(u => toReview(u, FsaeRole.SPONSOR)),
    ];
    }
}