import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class AdminLog extends Entity {
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
  adminId: string;

  @property({
    type: 'string',
    required: true,
  })
  action: string;

  @property({
    type: 'string',
    required: true,
  })
  targetType: string;

  @property({
    type: 'string',
  })
  targetId?: string;

  @property({
    type: 'object',
  })
  metadata?: object;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  timestamp?: string;

  constructor(data?: Partial<AdminLog>) {
    super(data);
  }
}

export interface AdminLogRelations {
}

export type AdminLogWithRelations = AdminLog & AdminLogRelations;
