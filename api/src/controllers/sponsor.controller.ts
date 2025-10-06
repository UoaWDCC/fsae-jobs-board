import {
  AnyObject,
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {FsaeRole, Sponsor} from '../models';
import {SponsorRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  SponsorProfileDto,
  SponsorProfileDtoFields,
} from '../dtos/sponsor-profile.dto';
import {ownerOnly} from '../decorators/owner-only.decorator';
import {Notification} from '../models/notification.model';

@authenticate('fsae-jwt')
export class SponsorController {
  constructor(
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
    @repository(SponsorRepository)
    public sponsorRepository: SponsorRepository,
  ) {}

  @authorize({
    allowedRoles: [
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/sponsor')
  @response(200, {
    description: 'Array of Sponsor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Sponsor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Sponsor) filter?: Filter<Sponsor>,
  ): Promise<Sponsor[]> {
    return this.sponsorRepository.find(filter);
  }

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR, FsaeRole.MEMBER, FsaeRole.ALUMNI],
  })
  @get('/user/sponsor/{id}')
  @response(200, {
    description: 'Sponsor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SponsorProfileDto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<SponsorProfileDto> {
    return this.sponsorRepository.findById(id, SponsorProfileDtoFields);
  }

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/sponsor/{id}')
  @response(204, {
    description: 'Sponsor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SponsorProfileDto, {partial: true}),
        },
      },
    })
    sponsorDto: Partial<SponsorProfileDto>,
  ): Promise<void> {
    await this.sponsorRepository.updateById(id, sponsorDto);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.SPONSOR],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @del('/user/sponsor/{id}')
  @response(204, {
    description: 'Sponsor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sponsorRepository.deleteById(id);
  }

  @authorize({
    allowedRoles: [FsaeRole.SPONSOR],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/sponsor/notifications/{id}/read-all')
  @response(204, {
    description: 'Notifications marked as read',
  })
  async markAllNotificationsAsRead(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.sponsorRepository.updateById(id, {
      $set: {
        'notifications.$[].read': true,
      },
    } as AnyObject);
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.SPONSOR]})
  @ownerOnly({ownerField: 'id'})
  @get('/user/sponsor/notifications/{id}')
  @response(200, {
    description: 'All notifications for user',
  })
  async getNotifications(@param.path.string('id') id: string): Promise<{
    notifications: Notification[];
    hasUnread: boolean;
    unreadCount: number;
  }> {
    const user = await this.sponsorRepository.findById(id, {
      fields: {notifications: true, id: true},
    });

    const notifications = (user.notifications ?? []).sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );

    const unreadCount = notifications.reduce((n, x) => n + (x.read ? 0 : 1), 0);

    return {
      notifications,
      hasUnread: unreadCount > 0,
      unreadCount,
    };
  }
}
