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
import {Member} from '../models';
import {MemberRepository} from '../repositories';

export class MemberController {
  constructor(
    @repository(MemberRepository)
    public memberRepository : MemberRepository,
  ) {}

  @post('/members')
  @response(200, {
    description: 'Member model instance',
    content: {'application/json': {schema: getModelSchemaRef(Member)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {
            title: 'NewMember',
            exclude: ['id'],
          }),
        },
      },
    })
    member: Omit<Member, 'id'>,
  ): Promise<Member> {
    return this.memberRepository.create(member);
  }

  @get('/members/count')
  @response(200, {
    description: 'Member model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Member) where?: Where<Member>,
  ): Promise<Count> {
    return this.memberRepository.count(where);
  }

  @get('/members')
  @response(200, {
    description: 'Array of Member model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Member, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Member) filter?: Filter<Member>,
  ): Promise<Member[]> {
    return this.memberRepository.find(filter);
  }

  @patch('/members')
  @response(200, {
    description: 'Member PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {partial: true}),
        },
      },
    })
    member: Member,
    @param.where(Member) where?: Where<Member>,
  ): Promise<Count> {
    return this.memberRepository.updateAll(member, where);
  }

  @get('/members/{id}')
  @response(200, {
    description: 'Member model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Member, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Member, {exclude: 'where'}) filter?: FilterExcludingWhere<Member>
  ): Promise<Member> {
    return this.memberRepository.findById(id, filter);
  }

  @patch('/members/{id}')
  @response(204, {
    description: 'Member PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {partial: true}),
        },
      },
    })
    member: Member,
  ): Promise<void> {
    await this.memberRepository.updateById(id, member);
  }

  @put('/members/{id}')
  @response(204, {
    description: 'Member PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() member: Member,
  ): Promise<void> {
    await this.memberRepository.replaceById(id, member);
  }

  @del('/members/{id}')
  @response(204, {
    description: 'Member DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.memberRepository.deleteById(id);
  }
}
