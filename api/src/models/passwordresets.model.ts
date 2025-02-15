import {Entity, model, property} from '@loopback/repository';

@model()
export class PasswordResets extends Entity {
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
  resetToken: string;

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
  fsaeRole: string;

  @property({
    type: 'string',
    required: true,
  })
  twilioId: string;

  constructor(data?: Partial<PasswordResets>) {
    super(data);
  }
}

export interface PasswordResetsRelations {
  // define navigational properties here if needed
}

export type PasswordResetsWithRelations = PasswordResets & PasswordResetsRelations;