import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Alumni, AlumniRelations} from '../models';

export class AlumniRepository extends DefaultCrudRepository<
  Alumni,
  typeof Alumni.prototype.alumniID,
  AlumniRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Alumni, dataSource);
  }
}
