import {Entity, model, property} from '@loopback/repository';

@model()
export class ApplicationNonce extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  nonce: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['pending', 'used'],
    },
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  memberId: string;

  @property({
    type: 'string',
    required: true,
  })
  jobId: string;

  @property({
    type: 'date',
    required: true,
  })
  expiresAt: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt: Date;

  constructor(data?: Partial<ApplicationNonce>) {
    super(data);
  }
}

export interface ApplicationNonceRelations {
  // describe navigational properties here
}

export type ApplicationNonceWithRelations = ApplicationNonce & ApplicationNonceRelations;
