import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model({settings: {strict: false}})
export class Member extends FsaeUser {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  memberID?: number;

  @property({
    type: 'number',
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
  cv: string;

  @property({
    type: 'string',
    required: true,
  })
  subGroup: string;

  @property({
    type: 'string',
    required: true,
  })
  photo: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}

export interface MemberRelations {
  // describe navigational properties here
}

export type MemberWithRelations = Member & MemberRelations;
