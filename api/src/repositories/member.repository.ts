import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Member, MemberRelations} from '../models';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.memberID,
  MemberRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Member, dataSource);
  }
}
