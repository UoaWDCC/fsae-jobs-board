import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Application,
  Member,
} from '../models';
import {ApplicationRepository} from '../repositories';

export class ApplicationMemberController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
  ) { }

  @get('/applications/{id}/member', {
    responses: {
      '200': {
        description: 'Member belonging to Application',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Member),
          },
        },
      },
    },
  })
  async getMember(
    @param.path.number('id') id: typeof Application.prototype.applicationID,
  ): Promise<Member> {
    return this.applicationRepository.submits(id);
  }
}
