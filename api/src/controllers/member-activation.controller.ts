import {
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
  HttpErrors,
} from '@loopback/rest';
import {FsaeUser} from '../models';
import {FsaeUserRepository, AdminRepository, AlumniRepository, MemberRepository, SponsorRepository} from '../repositories';

// Import authentication and authorization modules
import {authenticate} from '@loopback/authentication';
import {authorize} from '../auth/authorization/FsaeAuthorizationProvider';
import {inject} from '@loopback/core';
import {JwtService, PasswordHasherService} from '../services';

export class MemberActivationController {
  constructor(
    @repository(FsaeUserRepository) public fsaeUserRepository: FsaeUserRepository,
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(AlumniRepository) private alumniRepository: AlumniRepository,
    @repository(MemberRepository) private memberRepository: MemberRepository,
    @repository(SponsorRepository) private sponsorRepository: SponsorRepository,
    @inject('services.jwtservice') private jwtService: JwtService,
    @inject('services.passwordhasher') private passwordHasher: PasswordHasherService,
  ) {}

  // Check if a user is active
  @get('/fsae-users/{id}/activated')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN', 'SPONSOR', 'ALUMNI'], 
  })
  @response(200, {
    description: 'Check if user is activated',
    content: {'application/json': {schema: {type: 'boolean'}}},
  })
  async isActivated(@param.path.number('id') id: number): Promise<boolean> {
    const user = await this.fsaeUserRepository.findById(id);
    if (!user) {
      throw new HttpErrors.NotFound(`User with id ${id} not found.`);
    }
    return user.activated;

  @post('/fsae-users')
  @response(200, {
    description: 'FsaeUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(FsaeUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FsaeUser, {
            title: 'NewFsaeUser',
            exclude: ['id'],
          }),
        },
      },
    })
    fsaeUser: Omit<FsaeUser, 'id'>,
  ): Promise<FsaeUser> {
    return this.fsaeUserRepository.create(fsaeUser);
  }

  @get('/fsae-users/count')
  @response(200, {
    description: 'FsaeUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FsaeUser) where?: Where<FsaeUser>,
  ): Promise<Count> {
    return this.fsaeUserRepository.count(where);
  }

  @get('/fsae-users')
  @response(200, {
    description: 'Array of FsaeUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FsaeUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FsaeUser) filter?: Filter<FsaeUser>,
  ): Promise<FsaeUser[]> {
    return this.fsaeUserRepository.find(filter);
  }

  @patch('/fsae-users')
  @response(200, {
    description: 'FsaeUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FsaeUser, {partial: true}),
        },
      },
    })
    fsaeUser: FsaeUser,
    @param.where(FsaeUser) where?: Where<FsaeUser>,
  ): Promise<Count> {
    return this.fsaeUserRepository.updateAll(fsaeUser, where);
  }

  @get('/fsae-users/{id}')
  @response(200, {
    description: 'FsaeUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FsaeUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FsaeUser, {exclude: 'where'}) filter?: FilterExcludingWhere<FsaeUser>
  ): Promise<FsaeUser> {
    return this.fsaeUserRepository.findById(id, filter);
  }

  @patch('/fsae-users/{id}')
  @response(204, {
    description: 'FsaeUser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FsaeUser, {partial: true}),
        },
      },
    })
    fsaeUser: FsaeUser,
  ): Promise<void> {
    await this.fsaeUserRepository.updateById(id, fsaeUser);
  }

  @put('/fsae-users/{id}')
  @response(204, {
    description: 'FsaeUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() fsaeUser: FsaeUser,
  ): Promise<void> {
    await this.fsaeUserRepository.replaceById(id, fsaeUser);
  }

  @del('/fsae-users/{id}')
  @response(204, {
    description: 'FsaeUser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.fsaeUserRepository.deleteById(id);
  }
}
