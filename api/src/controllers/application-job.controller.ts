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
  JobAd,
} from '../models';
import {ApplicationRepository} from '../repositories';

export class ApplicationJobController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
  ) { }

}
