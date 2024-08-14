import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevInMemDataSource} from '../datasources';
import {Application, ApplicationRelations} from '../models';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.applicationID,
  ApplicationRelations
> {
  constructor(
    @inject('datasources.devInMem') dataSource: DevInMemDataSource,
  ) {
    super(Application, dataSource);
  }
}
