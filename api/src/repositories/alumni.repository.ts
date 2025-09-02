import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Alumni} from '../models';

export class AlumniRepository extends DefaultCrudRepository<
  Alumni,
  typeof Alumni.prototype.id
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Alumni, dataSource);
  }
}
