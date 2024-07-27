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
} from '@loopback/rest';
import {Sponsor} from '../models';
import {SponsorRepository} from '../repositories';

export class SponsorController {
  constructor(
    @repository(SponsorRepository)
    public sponsorRepository : SponsorRepository,
  ) {}

  @post('/sponsors')
  @response(200, {
    description: 'Sponsor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Sponsor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sponsor, {
            title: 'NewSponsor',
            exclude: ['id'],
          }),
        },
      },
    })
    sponsor: Omit<Sponsor, 'id'>,
  ): Promise<Sponsor> {
    return this.sponsorRepository.create(sponsor);
  }

  @get('/sponsors/count')
  @response(200, {
    description: 'Sponsor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Sponsor) where?: Where<Sponsor>,
  ): Promise<Count> {
    return this.sponsorRepository.count(where);
  }

  @get('/sponsors')
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

  @patch('/sponsors')
  @response(200, {
    description: 'Sponsor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sponsor, {partial: true}),
        },
      },
    })
    sponsor: Sponsor,
    @param.where(Sponsor) where?: Where<Sponsor>,
  ): Promise<Count> {
    return this.sponsorRepository.updateAll(sponsor, where);
  }

  @get('/sponsors/{id}')
  @response(200, {
    description: 'Sponsor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Sponsor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Sponsor, {exclude: 'where'}) filter?: FilterExcludingWhere<Sponsor>
  ): Promise<Sponsor> {
    return this.sponsorRepository.findById(id, filter);
  }

  @patch('/sponsors/{id}')
  @response(204, {
    description: 'Sponsor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sponsor, {partial: true}),
        },
      },
    })
    sponsor: Sponsor,
  ): Promise<void> {
    await this.sponsorRepository.updateById(id, sponsor);
  }

  @put('/sponsors/{id}')
  @response(204, {
    description: 'Sponsor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() sponsor: Sponsor,
  ): Promise<void> {
    await this.sponsorRepository.replaceById(id, sponsor);
  }

  @del('/sponsors/{id}')
  @response(204, {
    description: 'Sponsor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.sponsorRepository.deleteById(id);
  }
}
