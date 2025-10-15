import {Entity, model, property} from '@loopback/repository';

@model()
export class TallyForm extends Entity {
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
  jobId: string;

  @property({
    type: 'string',
    required: true,
  })
  tallyFormId: string;

  @property({
    type: 'string',
    required: true,
  })
  formTitle: string;

  @property({
    type: 'string',
    required: false,
  })
  embedCode?: string;

  @property({
    type: 'string',
    required: false,
  })
  previewUrl?: string;

  @property({
    type: 'string',
    required: false,
  })
  editUrl?: string;

  @property({
    type: 'number',
    default: 0,
  })
  submissionCount: number;

  @property({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @property({
    type: 'string',
    required: true,
    default: 'platform-applicant-auth-token',
  })
  applicantAuthFieldName: string;

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

  constructor(data?: Partial<TallyForm>) {
    super(data);
  }
}

export interface TallyFormRelations {
  // describe navigational properties here
}

export type TallyFormWithRelations = TallyForm & TallyFormRelations;