import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevInMemDataSource} from '../datasources';
import {FsaeUser, FsaeUserRelations} from '../models';

export class FsaeUserRepository extends DefaultCrudRepository<
  FsaeUser,
  typeof FsaeUser.prototype.id,
  FsaeUserRelations
> {
  constructor(
    @inject('datasources.devInMem') dataSource: DevInMemDataSource,
  ) {
    super(FsaeUser, dataSource);
  }
}
