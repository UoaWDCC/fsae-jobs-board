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
  verification_code: string;

  @property({
    type: 'string',
    required: true,
  })
  fsaeRole: string;

  @property({
    type: 'string',
    required: true,
  })
  twilioId: string;

  constructor(data?: Partial<Verification>) {
    super(data);
  }
}

export interface VerificationRelations {
  // define navigational properties here if needed
}

export type VerificationWithRelations = Verification & VerificationRelations;