import {Entity, model, property} from '@loopback/repository';

@model()
export class TallySubmission extends Entity {
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
  formId: string;

  @property({
    type: 'string',
    required: true,
  })
  tallySubmissionId: string;

  @property({
    type: 'string',
    required: true,
  })
  applicantId: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['member', 'alumni'],
    },
  })
  applicantRole: string;

  @property({
    type: 'string',
    required: false,
  })
  applicantEmail?: string;

  @property({
    type: 'string',
    required: false,
  })
  applicantName?: string;

  @property({
    type: 'object',
    required: true,
  })
  submissionData: object;

  @property({
    type: 'string',
    required: true,
    default: 'unread',
    jsonSchema: {
      enum: ['unread', 'reviewed', 'shortlisted', 'rejected'],
    },
  })
  status: string;

  @property({
    type: 'string',
    required: false,
  })
  notes?: string;

  @property({
    type: 'string',
    required: false,
  })
  reviewedBy?: string;

  @property({
    type: 'date',
    required: false,
  })
  reviewedAt?: Date;

  @property({
    type: 'date',
    required: true,
  })
  submittedAt: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt: Date;

  constructor(data?: Partial<TallySubmission>) {
    super(data);
  }
}

export interface TallySubmissionRelations {
  // describe navigational properties here
}

export type TallySubmissionWithRelations = TallySubmission & TallySubmissionRelations;