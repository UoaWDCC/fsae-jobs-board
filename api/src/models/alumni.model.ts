import {model, property} from '@loopback/repository';
import {FsaeUser} from './index';

@model({settings: {strict: false}})
export class Alumni extends FsaeUser {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  alumniID?: string;

  @property({
    type: 'string',
    required: false,
  })
  subGroup?: string;

  @property({
    type: 'string',
    required: false,
  })
  company?: string;

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
