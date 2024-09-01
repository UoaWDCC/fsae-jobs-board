import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {JobAd, JobAdRelations} from '../models';

export class JobAdRepository extends DefaultCrudRepository<
  JobAd,
  typeof JobAd.prototype.id,
  JobAdRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(JobAd, dataSource);
  }
}
