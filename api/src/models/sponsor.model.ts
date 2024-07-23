import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model({settings: {strict: false}})
export class Sponsor extends FsaeUser {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  sponsorID?: number;

  @property({
    type: 'string',
    required: true,
  })
  logo: string;

  @property({
    type: 'string',
    required: true,
  })
  websiteURL: string;

  @property({
    type: 'string',
    required: true,
  })
  tier: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  industry: string;

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
