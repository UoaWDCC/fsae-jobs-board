import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Verification, VerificationRelations} from '../models';

export class VerificationRepository extends DefaultCrudRepository<
  Verification,
  typeof Verification.prototype.id,
  VerificationRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Verification, dataSource);
  }
}
