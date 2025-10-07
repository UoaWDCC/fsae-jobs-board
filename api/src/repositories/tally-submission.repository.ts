import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {TallySubmission, TallySubmissionRelations} from '../models';

export class TallySubmissionRepository extends DefaultCrudRepository<
  TallySubmission,
  typeof TallySubmission.prototype.id,
  TallySubmissionRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(TallySubmission, dataSource);
  }
}