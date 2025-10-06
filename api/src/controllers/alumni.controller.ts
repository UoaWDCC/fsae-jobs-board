import {AnyObject, Filter, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Alumni, FsaeRole} from '../models';
import {
  AlumniProfileDto,
  AlumniProfileDtoFields,
} from '../dtos/alumni-profile.dto';
import {AlumniRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {ownerOnly} from '../decorators/owner-only.decorator';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Notification} from '../models/notification.model';

@authenticate('fsae-jwt')
export class AlumniController {
  constructor(
    @repository(AlumniRepository)
    public alumniRepository: AlumniRepository,
    @inject(SecurityBindings.USER) protected currentUserProfile: UserProfile,
  ) {}

  @authorize({
    allowedRoles: [
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/alumni')
  @response(200, {
    description: 'Array of Alumni model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Alumni, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Alumni) filter?: Filter<Alumni>): Promise<Alumni[]> {
    return this.alumniRepository.find(filter);
  }

  @authorize({
    allowedRoles: [
      FsaeRole.ALUMNI,
      FsaeRole.MEMBER,
      FsaeRole.SPONSOR,
      FsaeRole.ADMIN,
    ],
  })
  @get('/user/alumni/{id}')
  @response(200, {
    description: 'Alumni model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AlumniProfileDto, {
          title: 'Alumni Profile',
        }),
      },
    },
  })
  async getAlumniProfile(
    @param.path.string('id') id: string,
  ): Promise<AlumniProfileDto> {
    const result = await this.alumniRepository.findById(id, {
      fields: AlumniProfileDtoFields,
    });
    return result as AlumniProfileDto;
  }

  @patch('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni PATCH success',
  })
  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  async updateAlumniProfile(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AlumniProfileDto, {partial: true}),
        },
      },
    })
    alumniDto: Partial<AlumniProfileDto>,
  ): Promise<void> {
    await this.alumniRepository.updateById(id, alumniDto);
  }

  @authorize({
    allowedRoles: [FsaeRole.ADMIN, FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @del('/user/alumni/{id}')
  @response(204, {
    description: 'Alumni DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.alumniRepository.deleteById(id);
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI],
  })
  @ownerOnly({
    ownerField: 'id',
  })
  @patch('/user/alumni/notifications/{id}/read-all')
  @response(204, {
    description: 'Notifications marked as read',
  })
  async markAllNotificationsAsRead(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.alumniRepository.updateById(id, {
      $set: {
        'notifications.$[].read': true,
      },
    } as AnyObject);
  }

  @authenticate('fsae-jwt')
  @authorize({allowedRoles: [FsaeRole.ALUMNI]})
  @ownerOnly({ownerField: 'id'})
  @get('/user/alumni/notifications/{id}')
  @response(200, {
    description: 'All notifications for user',
  })
  async getNotifications(@param.path.string('id') id: string): Promise<{
    notifications: Notification[];
    hasUnread: boolean;
    unreadCount: number;
  }> {
    const user = await this.alumniRepository.findById(id, {
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
