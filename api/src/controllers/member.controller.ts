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
import { authenticate } from '@loopback/authentication';

@authenticate('fsae-jwt')
export class MemberController {
  constructor(
    @repository(MemberRepository)
    public memberRepository : MemberRepository,
  ) {}

  @get('/user/member/{id}')
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

  @patch('/user/member/{id}')
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

  @del('/user/member/{id}')
  @response(204, {
    description: 'Member DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.memberRepository.deleteById(id);
  }
}
