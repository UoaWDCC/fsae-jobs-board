import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ApplicationNonce, ApplicationNonceRelations} from '../models';

export class ApplicationNonceRepository extends DefaultCrudRepository<
  ApplicationNonce,
  typeof ApplicationNonce.prototype.nonce,
  ApplicationNonceRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ApplicationNonce, dataSource);
  }
}
