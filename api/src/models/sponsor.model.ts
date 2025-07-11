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

  // default values for optional fields
  subGroup?: string = 'Fsae club';
  company?: string = 'Fsae club';
  websiteURL?: string = '';
  tier?: string = '';
  industry?: string = '';
  name?: string = 'Sponsor';

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
