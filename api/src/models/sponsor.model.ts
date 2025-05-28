import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model({settings: {strict: false}})
export class Sponsor extends FsaeUser {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  sponsorID?: string;

  @property({
    type: 'string',
    required: false,
  })
  logo?: string;

  @property({
    type: 'string',
    required: false,
  })
  websiteURL?: string;

  @property({
    type: 'string',
    required: false,
  })
  tier?: string;

  @property({
    type: 'string',
    required: false,
  })
  name?: string;

  @property({
    type: 'string',
    required: false,
  })
  industry?: string;

  @property({
    type: 'string',
    required: false,
  })
  company?: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Sponsor>) {
    super(data);
  }
}

export interface SponsorRelations {
  // describe navigational properties here
}

export type SponsorWithRelations = Sponsor & SponsorRelations;
