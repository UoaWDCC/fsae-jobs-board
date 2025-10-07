import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {TallyWebhook, TallyWebhookRelations} from '../models';

export class TallyWebhookRepository extends DefaultCrudRepository<
  TallyWebhook,
  typeof TallyWebhook.prototype.id,
  TallyWebhookRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(TallyWebhook, dataSource);
  }
}