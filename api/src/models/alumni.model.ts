import {model, property} from '@loopback/repository';
import {FsaeUser} from './index';

@model({settings: {strict: false}})
export class Alumni extends FsaeUser {
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

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Alumni>) {
    super(data);
  }
}

export interface AlumniRelations {
  // describe navigational properties here
}

export type AlumniWithRelations = Alumni & AlumniRelations;
