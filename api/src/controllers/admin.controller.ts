import {
  repository
} from '@loopback/repository';
import {service} from '@loopback/core';
import {
  get,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';

import {Alumni, FsaeRole, FsaeUser, Member, Sponsor} from '../models';
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
import { AdminLogService } from '../services/admin-log.service';

@authenticate('fsae-jwt')
export class AdminController {
  constructor(
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @service(AdminLogService) private adminLogService: AdminLogService,
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

    const toReview = (u: Alumni | Member | Sponsor, role: FsaeRole): AdminReview => {
      const id = u.id.toString();

      let name = ""
      if ('firstName' in u) {
        name = `${u.firstName} ${u.lastName}`
      } else if ('companyName' in u) {
        name = u.companyName
      }

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
      await this.adminLogService.createAdminLog(
        this.currentUser[securityId] as string,
        {
          message: `Application ${status.toLowerCase()}`,
          targetType: role.toLowerCase(),
          targetId: id,
          memberType: role
        }
      );
    } catch (e: any) {
      if (e.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.NotFound(`User ${id} not found in ${role} collection`);
      }
      throw e; // propagate other errors
    }
  }

  /**
   * PATCH /user/admin/deactivate/{id}
   * Deactivate a user account with a reason.
   */
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @patch('/user/admin/deactivate/{id}')
  @response(204, {description: 'User account deactivated'})
  async deactivateUser(
    @param.path.string('id') id: string,
    @requestBody({
      required: true,
      description: 'User role and deactivation reason',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['role', 'reason'],
            properties: {
              role: {
                type: 'string',
                enum: [FsaeRole.ALUMNI, FsaeRole.MEMBER, FsaeRole.SPONSOR],
              },
              reason: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    body: {role: FsaeRole; reason: string},
  ): Promise<void> {
    const {role, reason} = body;

    /* pick the correct repository based on role */
    let repo;
  
    if (role === FsaeRole.ALUMNI) {
      repo = this.alumniRepository;
    } else if (role === FsaeRole.MEMBER) {
      repo = this.memberRepository;
    } else if (role === FsaeRole.SPONSOR) {
      repo = this.sponsorRepository;
    } else {
      repo = undefined;
    }

    if (!repo) {
      throw new HttpErrors.BadRequest(`Unsupported role "${role}"`);
    }

    /* deactivate the user; throw 404 if not found */
    try {
      await repo.updateById(id, {activated: false});
      await this.adminLogService.createAdminLog(
        this.currentUser[securityId] as string,
        {
          message: `Account deactivated`,
          reason: reason,
          targetType: role.toLowerCase(),
          targetId: id,
          memberType: role
        }
      );
    } catch (e: any) {
      if (e.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.NotFound(`User ${id} not found in ${role} collection`);
      }
      throw e;
    }
  }

  /**
   * PATCH /user/admin/activate/{id}
   * Activate a user account.
   */
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @patch('/user/admin/activate/{id}')
  @response(204, {description: 'User account activated'})
  async activateUser(
    @param.path.string('id') id: string,
    @requestBody({
      required: true,
      description: 'User role',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['role'],
            properties: {
              role: {
                type: 'string',
                enum: [FsaeRole.ALUMNI, FsaeRole.MEMBER, FsaeRole.SPONSOR],
              },
            },
          },
        },
      },
    })
    body: {role: FsaeRole},
  ): Promise<void> {
    const {role} = body;

    /* pick the correct repository based on role */
    let repo;
  
    if (role === FsaeRole.ALUMNI) {
      repo = this.alumniRepository;
    } else if (role === FsaeRole.MEMBER) {
      repo = this.memberRepository;
    } else if (role === FsaeRole.SPONSOR) {
      repo = this.sponsorRepository;
    } else {
      repo = undefined;
    }

    if (!repo) {
      throw new HttpErrors.BadRequest(`Unsupported role "${role}"`);
    }

    /* activate the user; throw 404 if not found */
    try {
      await repo.updateById(id, {activated: true});
      await this.adminLogService.createAdminLog(
        this.currentUser[securityId] as string,
        {
          message: 'Account activated',
          targetType: role.toLowerCase(),
          targetId: id,
          memberType: role
        }
      );
    } catch (e: any) {
      if (e.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.NotFound(`User ${id} not found in ${role} collection`);
      }
      throw e;
    }
  }

  /**
   * POST /user/admin
   * Create a new admin account.
   */
  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @post('/user/admin')
  @response(201, {
    description: 'Admin account created successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            email: {type: 'string'},
            message: {type: 'string'}
          }
        }
      }
    }})
  async createAdmin(
    @requestBody({
      required: true,
      description: 'Admin account details',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'firstName', 'lastName', 'phoneNumber', 'role'],
            properties: {
              email: {type: 'string', format: 'email'},
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              phoneNumber: {type: 'string'},
              role: {
                type: 'string',
                enum: [FsaeRole.ALUMNI, FsaeRole.MEMBER]
              }
            }
          }
        }
      }
    })
    adminData: {
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      role: FsaeRole.ALUMNI | FsaeRole.MEMBER;
    }
  ): Promise<{id: string; email: string; message: string}> {
    const {email, firstName, lastName, phoneNumber, role} = adminData;

    // Pick the correct repository based on role
    let repo;
    if (role === FsaeRole.ALUMNI) {
      repo = this.alumniRepository;
    } else if (role === FsaeRole.MEMBER) {
      repo = this.memberRepository;
    } else {
      throw new HttpErrors.BadRequest(`Unsupported role "${role}" for admin creation`);
    }

    // Check if user with this email already exists
    const existingUser = await repo.findOne({where: {email}});
    if (existingUser) {
      throw new HttpErrors.Conflict(`User with email ${email} already exists`);
    }

    try {
      // Create the new admin user with pre-approved status
      const newAdmin = await repo.create({
        email,
        firstName,
        lastName,
        phoneNumber,
        adminStatus: AdminStatus.APPROVED,
        activated: true,
        createdAt: new Date()
      });

      // Log the admin creation
      await this.adminLogService.createAdminLog(
        this.currentUser[securityId] as string,
        {
          message: `Admin account created`,
          targetType: role.toLowerCase(),
          targetId: newAdmin.id.toString(),
          memberType: role
        }
      );

      return {
        id: newAdmin.id.toString(),
        email: newAdmin.email,
        message: 'Admin account created successfully'
      };
    } catch (error: any) {
      throw new HttpErrors.InternalServerError(`Failed to create admin account: ${error.message}`);
    }
  }
}