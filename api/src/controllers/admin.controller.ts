import {
  repository,
} from '@loopback/repository';
import {
  get,
  response,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';

import {FsaeRole, FsaeUser} from '../models';
import {
  AlumniRepository,
  MemberRepository,
  SponsorRepository,
} from '../repositories';
import {AdminReview} from './controller-types/admin.controller.types';

@authenticate('fsae-jwt')
export class AdminController {
  constructor(
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
  ) {}

  /**
   * Consolidated list of every user awaiting admin review.
   */
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @get('/user/admin/dashboard')
  @response(200, {
    description: 'Array of users (alumni / member / sponsor) with admin-review metadata',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              name: {type: 'string'},
              role: {type: 'string'},
              date: {type: 'string', format: 'date-time'},
              status: {type: 'string'},
            },
          },
        },
      },
    },
  })
  async getAllUsers(): Promise<AdminReview[]> {
    const [alumni, members, sponsors] = await Promise.all([
      this.alumniRepository.find(),
      this.memberRepository.find(),
      this.sponsorRepository.find(),
    ]);

    const toReview = (u: FsaeUser, role: FsaeRole): AdminReview => {
      const id = (u._id ?? u.id).toString();
      const name =
        u.lastName && u.lastName !== '-'
          ? `${u.firstName} ${u.lastName}`
          : u.firstName;
      const created = u.createdAt ?? new Date(parseInt(id.slice(0, 8), 16) * 1000);

      return {
        id,
        name,
        role,
        date: created,
        status: u.adminStatus ?? 'pending',
      };
    };

    return [
      ...alumni.map(a   => toReview(a, FsaeRole.ALUMNI)),
      ...members.map(m  => toReview(m, FsaeRole.MEMBER)),
      ...sponsors.map(s => toReview(s, FsaeRole.SPONSOR)),
    ];
  }
}