import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Sponsor, SponsorRelations} from '../models';

export class SponsorRepository extends DefaultCrudRepository<
  Sponsor,
  typeof Sponsor.prototype.sponsorID,
  SponsorRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Sponsor, dataSource);
  }
}
