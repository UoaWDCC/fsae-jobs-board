import {Entity, model, property} from '@loopback/repository';

@model()
export class Verification extends Entity {
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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  verificationCode: string;

  @property({
    type: 'number',
    required: true,
  })
  createdAt: number;

  @property({
    type: 'number',
    required: true,
  })
  expiresAt: number;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'boolean',
    required: true,
  })
  resentOnce: boolean;

  constructor(data?: Partial<Verification>) {
    super(data);
  }
}

export interface VerificationRelations {
  // define navigational properties here if needed
}

export type VerificationWithRelations = Verification & VerificationRelations;