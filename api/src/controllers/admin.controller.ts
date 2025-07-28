import {
  repository,
} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';

import {FsaeRole, FsaeUser} from '../models';
import {
  AlumniRepository,
  MemberRepository,
  SponsorRepository,
  AdminLogRepository
} from '../repositories';
import {AdminReview} from './controller-types/admin.controller.types';
import { AdminStatus } from '../models/admin.status';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';


@authenticate('fsae-jwt')
export class AdminController {
  constructor(
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @repository(AdminLogRepository) private adminLogRepository: AdminLogRepository,
    @inject(SecurityBindings.USER) private currentUser: UserProfile,

  ) {}

   /**
   * GET /user/admin/dashboard
   * Returns every Alumni / Member / Sponsor in a flat array,
   * with name, role, created-at date, and current admin-approval status.
   */
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @get('/user/admin/dashboard')
  @response(200, {
    description: 'Array of users awaiting (or finished) admin review',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id:     {type: 'string'},
              contact: {type: 'string'},
              email:  {type: 'string', format: 'email'},
              name:   {type: 'string'},
              role:   {type: 'string'},
              date:   {type: 'string', format: 'date-time'},
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
      const id = u.id.toString();

      const name =
        u.lastName && u.lastName !== '-'
          ? `${u.firstName} ${u.lastName}`
          : u.firstName;

      // `createdAt` may not exist → fall back to ObjectId timestamp
      const created =
        u.createdAt ?? new Date(parseInt(id.slice(0, 8), 16) * 1000);

      return {
        id,
        contact: u.phoneNumber ?? '',
        name: name ?? '',
        email: u.email ?? '',
        role,
        date: created,
        status: u.adminStatus ?? AdminStatus.PENDING,
      };
    };

    return [
      ...alumni.map(a   => toReview(a, FsaeRole.ALUMNI)),
      ...members.map(m  => toReview(m, FsaeRole.MEMBER)),
      ...sponsors.map(s => toReview(s, FsaeRole.SPONSOR)),
    ];
  }

  /**
 * PATCH /user/admin/status/{id}
 * Approve or reject a pending user request.
 */
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @patch('/user/admin/status/{id}')
  @response(204, {description: 'Admin status updated'})
  async updateUserStatus(
    @param.path.string('id') id: string,
    @requestBody({
      required: true,
      description: 'Target role and new status',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['role', 'status'],
            properties: {
              role: {
                type: 'string',
                enum: [FsaeRole.ALUMNI, FsaeRole.MEMBER, FsaeRole.SPONSOR],
              },
              status: {
                type: 'string',
                enum: [AdminStatus.APPROVED, AdminStatus.REJECTED],
              },
            },
          },
        },
      },
    })
    body: {role: FsaeRole; status: AdminStatus},
  ): Promise<void> {
    const {role, status} = body;

    /* pick the correct repository based on role */
    let repo;
  
    if (role === FsaeRole.ALUMNI) {
      repo = this.alumniRepository;
    }else if (role === FsaeRole.MEMBER) {
      repo = this.memberRepository;
    } else if (role === FsaeRole.SPONSOR) {
      repo = this.sponsorRepository;
    } else {
      repo = undefined; // unsupported role
    }

    if (!repo) {
      throw new HttpErrors.BadRequest(`Unsupported role "${role}"`);
    }

    /* update the user; throw 404 if not found */
    try {
      await repo.updateById(id, {adminStatus: status});
      const user = await repo.findById(id);
      await this.adminLogRepository.create({
        adminId: this.currentUser[securityId] as string,
        action: `application-${status.toLowerCase()}`,
        targetType: role.toLowerCase(),
        targetId: id,
        metadata: {
          firstName: user.firstName,
          lastName: user.lastName,
          memberType: role,
        },
        timestamp: new Date().toISOString(),
    });
    } catch (e: any) {
      if (e.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.NotFound(`User ${id} not found in ${role} collection`);
      }
      throw e; // propagate other errors
    }
  }
}