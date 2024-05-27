import {Entity, model, property} from '@loopback/repository';

@model()
export class Require extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  jobID?: string;

  @property({
    type: 'string',
    required: true,
  })
  skillID: string;


  constructor(data?: Partial<Require>) {
    super(data);
  }
}

export interface RequireRelations {
  // describe navigational properties here
}

export type RequireWithRelations = Require & RequireRelations;
