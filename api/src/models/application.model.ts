import {Entity, model, property} from '@loopback/repository';

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
