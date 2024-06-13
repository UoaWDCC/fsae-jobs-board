import {Entity, model, property} from '@loopback/repository';

@model()
export class Degree extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  userID: string;

  @property({
    type: 'string',
    required: true,
  })
  degreeLevel: string;

  @property({
    type: 'string',
    required: true,
  })
  faculty: string;

  @property({
    type: 'string',
    required: true,
  })
  specialisation: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isConjoint: boolean;

  @property({
    type: 'number',
    required: true,
  })
  graduationYear: number;

  @property({
    type: 'number',
    required: true,
  })
  currentYear: number;


  constructor(data?: Partial<Degree>) {
    super(data);
  }
}

export interface DegreeRelations {
  // describe navigational properties here
}

export type DegreeWithRelations = Degree & DegreeRelations;
