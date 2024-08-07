import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevInMemDataSource} from '../datasources';
import {Member, MemberRelations} from '../models';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.memberID,
  MemberRelations
> {
  constructor(
    @inject('datasources.devInMem') dataSource: DevInMemDataSource,
  ) {
    super(Member, dataSource);
  }
}
