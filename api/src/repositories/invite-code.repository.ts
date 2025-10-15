import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { InviteCode, InviteCodeRelations } from '../models';

export class InviteCodeRepository extends DefaultCrudRepository<
    InviteCode,
    typeof InviteCode.prototype.id,
    InviteCodeRelations
> {
    constructor(
        @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    ) {
        super(InviteCode, dataSource);
    }
}
