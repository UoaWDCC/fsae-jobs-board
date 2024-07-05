import {model, property} from '@loopback/repository';
import {FsaeUser} from './index';

@model({settings: {strict: false}})
export class Alumni extends FsaeUser {
  // Define well-known properties here

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
