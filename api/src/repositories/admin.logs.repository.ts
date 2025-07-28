import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AdminLog, AdminLogRelations} from '../models/admin-log.model';

export class AdminLogRepository extends DefaultCrudRepository<
  AdminLog,
  typeof AdminLog.prototype.id,
  AdminLogRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource
  ) {
    super(AdminLog, dataSource);
  }
}
