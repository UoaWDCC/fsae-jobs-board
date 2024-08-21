import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Sponsor, SponsorRelations} from '../models';

export class SponsorRepository extends DefaultCrudRepository<
  Sponsor,
  typeof Sponsor.prototype.AlumniID,
  SponsorRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Sponsor, dataSource);
  }
}
