import {repository} from '@loopback/repository';
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
  AdminLogRepository,
  AdminRepository,
} from '../repositories';
import {AdminReview} from './controller-types/admin.controller.types';
import {AdminStatus} from '../models/admin.status';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Notification} from '../models/notification.model';
import {randomUUID} from 'crypto';
import {NotificationType} from '../models/notification.type';

@authenticate('fsae-jwt')
export class AdminController {
  constructor(
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AdminLogRepository)
    private adminLogRepository: AdminLogRepository,
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
              id: {type: 'string'},
              contact: {type: 'string'},
              email: {type: 'string', format: 'email'},
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

    const toReview = (
      u: Alumni | Member | Sponsor,
      role: FsaeRole,
    ): AdminReview => {
      const id = u.id.toString();

      let name = '';
      if ('firstName' in u) {
        name = `${u.firstName} ${u.lastName}`;
      } else if ('companyName' in u) {
        name = u.companyName;
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
      ...alumni.map(a => toReview(a, FsaeRole.ALUMNI)),
      ...members.map(m => toReview(m, FsaeRole.MEMBER)),
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
    } else if (role === FsaeRole.MEMBER) {
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
          //firstName: user.firstName,  // Issue: sponsors do not have a firstName/lastName.. only company name. Unify to a single name field?
          //lastName: user.lastName,
          memberType: role,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      if (e.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.NotFound(
          `User ${id} not found in ${role} collection`,
        );
      }
      throw e; // propagate other errors
    }
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @post('/user/admin/notify/{id}')
  @response(204, {description: 'Notification sent'})
  async notifyUser(
    @param.path.string('id') id: string,
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['title', 'msgBody', 'userType', 'type'],
            properties: {
              title: {type: 'string', minLength: 1},
              msgBody: {type: 'string', minLength: 1},
              userType: {
                type: 'string',
                enum: [
                  FsaeRole.ADMIN,
                  FsaeRole.ALUMNI,
                  FsaeRole.MEMBER,
                  FsaeRole.SPONSOR,
                ],
              },
              type: {
                type: 'string',
                enum: [
                  NotificationType.ANNOUNCEMENT,
                  NotificationType.NOTIFICATION,
                ],
              },
            },
          },
        },
      },
    })
    body: {
      title: string;
      msgBody: string;
      userType: FsaeRole;
      type: NotificationType;
    },
  ): Promise<void> {
    const {title, msgBody, userType, type} = body;
    const CAP = 50;

    const userRepository =
      userType === FsaeRole.ALUMNI
        ? this.alumniRepository
        : userType === FsaeRole.MEMBER
          ? this.memberRepository
          : userType === FsaeRole.SPONSOR
            ? this.sponsorRepository
            : this.adminRepository;

    const user = await userRepository.findById(id);
    user.notifications = user.notifications ?? [];

    const notification: Notification = new Notification({
      id: randomUUID(),
      issuer: this.currentUser[securityId] as string,
      title,
      msgBody,
      type,
      read: false,
      createdAt: new Date(),
    });

    //use slice so that we auto maintain the embeds to a max cap of CAP items. older notifs get dropped
    await userRepository.updateById(id, {
      $push: {
        notifications: {
          $each: [notification],
          $sort: {createdAt: -1},
          $slice: CAP,
        },
      },
    });
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ADMIN]})
  @post('/user/admin/announce')
  @response(200, {description: 'Announcement broadcasted successfully'})
  async announce(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['title', 'msgBody', 'userTypes'],
            properties: {
              title: {type: 'string', minLength: 1},
              msgBody: {type: 'string', minLength: 1},
              userTypes: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    FsaeRole.ADMIN,
                    FsaeRole.ALUMNI,
                    FsaeRole.MEMBER,
                    FsaeRole.SPONSOR,
                  ],
                },
                description:
                  'One or more user groups to send the announcement to',
              },
            },
          },
        },
      },
    })
    body: {
      title: string;
      msgBody: string;
      userTypes: FsaeRole[];
    },
  ): Promise<{sent: number}> {
    const {title, msgBody, userTypes} = body;
    const CAP = 50;

    const roleToRepo: Record<FsaeRole, any> = {
      [FsaeRole.ALUMNI]: this.alumniRepository,
      [FsaeRole.MEMBER]: this.memberRepository,
      [FsaeRole.SPONSOR]: this.sponsorRepository,
      [FsaeRole.ADMIN]: this.adminRepository,
      [FsaeRole.UNKNOWN]: undefined,
    };

    const announcement: Notification = new Notification({
      id: randomUUID(),
      issuer: this.currentUser[securityId] as string,
      title,
      msgBody,
      type: NotificationType.ANNOUNCEMENT, // ← always announcement
      read: false,
      createdAt: new Date(),
    });

    let totalSent = 0;

    for (const role of userTypes) {
      const repo = roleToRepo[role];
      if (!repo) continue;

      const users = await repo.find({fields: {id: true}});
      for (const user of users) {
        await repo.updateById(user.id, {
          $push: {
            notifications: {
              $each: [announcement],
              $sort: {createdAt: -1},
              $slice: CAP,
            },
          },
        });
        totalSent++;
      }
    }

    return {sent: totalSent};
  }
}
