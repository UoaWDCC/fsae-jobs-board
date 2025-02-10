import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PasswordResets, PasswordResetsRelations} from '../models';

export class PasswordResetsRepository extends DefaultCrudRepository<
  PasswordResets,
  typeof PasswordResets.prototype.id,
  PasswordResetsRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(PasswordResets, dataSource);
  }
}
