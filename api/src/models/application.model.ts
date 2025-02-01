import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Member} from './member.model';

// Todo need to add job ad ID in future after job ad ticket is done
@model()
export class Application extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  applicationID?: number;

  @property({
    type: 'number',
    default: 1,
  })
  status?: number;

  // Todo do we need time in date-time or just date?
  @property({
    type: 'date',
    required: true,
    jsonSchema: {
      format: 'date',
    },
  })
  applicationDate: string;

  @belongsTo(() => Member, {name: 'submits'})
  memberId: number;

  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  // describe navigational properties here
}

export type ApplicationWithRelations = Application & ApplicationRelations;
