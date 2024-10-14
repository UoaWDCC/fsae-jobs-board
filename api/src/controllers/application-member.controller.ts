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

}
