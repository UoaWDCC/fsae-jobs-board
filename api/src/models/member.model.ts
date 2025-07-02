import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model({settings: {strict: false}})
export class Member extends FsaeUser {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  memberID?: string;
  
  // default values for optional fields
  firstName?: string = 'Fsae';
  lastName?: string = 'member';
  cv?: string = '';
  subGroup?: string = 'Fsae club';
 
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
