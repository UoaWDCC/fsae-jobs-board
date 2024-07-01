import {Entity, model, property} from '@loopback/repository';

@model()
export class Sponsor extends Entity {
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


  constructor(data?: Partial<Sponsor>) {
    super(data);
  }
}

export interface SponsorRelations {
  // describe navigational properties here
}

export type SponsorWithRelations = Sponsor & SponsorRelations;
