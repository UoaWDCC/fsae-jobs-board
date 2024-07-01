import {Entity, model, property} from '@loopback/repository';

@model()
export class Alumni extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  alumniID?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  subGroup: string;

  @property({
    type: 'string',
    required: true,
  })
  company: string;


  constructor(data?: Partial<Alumni>) {
    super(data);
  }
}

export interface AlumniRelations {
  // describe navigational properties here
}

export type AlumniWithRelations = Alumni & AlumniRelations;
