import {Entity, model, property} from '@loopback/repository';

@model()
export class Application extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  memberID: string;

  @property({
    type: 'string',
    required: true,
  })
  jobID: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'date',
    required: true,
  })
  applicationDate: string;


  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  // describe navigational properties here
}

export type ApplicationWithRelations = Application & ApplicationRelations;
