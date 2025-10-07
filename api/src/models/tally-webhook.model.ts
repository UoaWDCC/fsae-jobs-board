import {Entity, model, property} from '@loopback/repository';

@model()
export class TallyWebhook extends Entity {
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
  tallyWebhookId: string;

  @property({
    type: 'string',
    required: true,
  })
  callbackUrl: string;

  @property({
    type: 'string',
    required: false,
  })
  secret?: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: ['FORM_RESPONSE'],
  })
  eventTypes: string[];

  @property({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @property({
    type: 'date',
    required: false,
  })
  lastSyncedAt?: Date;

  @property({
    type: 'number',
    default: 0,
  })
  deliveryCount: number;

  @property({
    type: 'number',
    default: 0,
  })
  errorCount: number;

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

  constructor(data?: Partial<TallyWebhook>) {
    super(data);
  }
}

export interface TallyWebhookRelations {
  // describe navigational properties here
}

export type TallyWebhookWithRelations = TallyWebhook & TallyWebhookRelations;