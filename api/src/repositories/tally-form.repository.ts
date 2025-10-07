import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {TallyForm, TallyFormRelations} from '../models';

export class TallyFormRepository extends DefaultCrudRepository<
  TallyForm,
  typeof TallyForm.prototype.id,
  TallyFormRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(TallyForm, dataSource);
  }
}