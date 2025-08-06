import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Sponsor} from '../models';

export class SponsorRepository extends DefaultCrudRepository<
  Sponsor,
  typeof Sponsor.prototype.id
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Sponsor, dataSource);
  }
}
