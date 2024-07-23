import {Entity, model, property} from '@loopback/repository';
import {FsaeRole} from './roles';
import {securityId, UserProfile} from '@loopback/security';

@model({settings: {strict: false}})
export abstract class FsaeUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    hidden: true
  })
  password: string;

  @property({
    type: 'boolean',
    required: true,
  })
  activated: boolean;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(FsaeRole),
    }
  })
  fsaeRole: FsaeRole;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'string',
  })
  desc?: string;

  public convertToSecurityUserProfile(): UserProfile {
    return {
      [securityId]: this.id as string,
      name: this.username,
      email: this.email,
    }
  }

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
}

export interface FsaeUserRelations {
  // describe navigational properties here
}

export type FsaeUserWithRelations = FsaeUser & FsaeUserRelations;
