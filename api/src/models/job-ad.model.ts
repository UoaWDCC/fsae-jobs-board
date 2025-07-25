import {Entity, model, property} from '@loopback/repository';

@model()
export class JobAd extends Entity {
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
  title: string;

  @property({
    type: 'date',
    required: true,
  })
  applicationDeadline: string;

  @property({
    type: 'string',
    required: true,
  })
  applicationLink: string;

  @property({
    type: 'date',
    required: true,
  })
  datePosted: string;

  @property({
    type: 'string',
    required: true,
  })
  specialisation: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
  })
  salary?: string;

  @property({
    type: 'string',
    required: true,
  })
  publisherID: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['Internship', 'Graduate', 'Junior'],
    },
  })
  roleType: string;


  constructor(data?: Partial<JobAd>) {
    super(data);
  }
}

export interface JobAdRelations {
  // describe navigational properties here
}

export type JobAdWithRelations = JobAd & JobAdRelations;
