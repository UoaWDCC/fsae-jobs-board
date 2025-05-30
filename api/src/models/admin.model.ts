import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model({settings: {strict: false}})
export class Admin extends FsaeUser {
  // Define well-known properties here

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  verified: boolean;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // describe navigational properties here
}

export type AdminWithRelations = Admin & AdminRelations;
