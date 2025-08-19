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

  // name, websiteURL, industry, and tier are already defined in parent FsaeUser class with @property decorators
  // The issue with field persistence is probably related to schema inheritance or validation

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
