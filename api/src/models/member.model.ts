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

  @property({
    type: 'buffer',
    mongodb: { dataType: 'binData' },
  })
  cvData?: Buffer;

  @property({
    type: 'string',
    default: '',
  })
  cvFileName?: string;

  @property({
    type: 'string',
    default: '',
  })
  cvMimeType?: string;

  @property({
    type: 'number',
    default: 0,
  })
  cvSize?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  cvUploadedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  hasCV?: boolean;
  
  // default values for optional fields
  firstName?: string = 'Fsae';
  lastName?: string = 'member';
  // cv?: string = '';
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
