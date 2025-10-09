import {Entity, model, property} from '@loopback/repository';

export interface AdminLogDetails {
  message: string;
  [key: string]: string;
}

export const LOG_TYPES = ['log', 'request'] as const;
export type LogType = (typeof LOG_TYPES)[number];

export const REQUEST_STATUSES = ['pending', 'accepted', 'rejected'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

@model({settings: {strict: true}})
export class AdminLog extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      type: 'object',
      properties: {message: {type: 'string'}},
      additionalProperties: {type: 'string'},
      required: ['message'],
    },
  })
  details: AdminLogDetails; // Log details object requires a message string, but can contain any other abitrary string fields too

  @property({
    type: 'string',
    jsonSchema: {enum: [...LOG_TYPES]},
    default: 'log',
  })
  logType: LogType;

  @property({
    type: 'string',
    jsonSchema: {enum: [...REQUEST_STATUSES]},
  })
  status?: RequestStatus;

  @property({type: 'date', required: true, defaultFn: 'now'})
  createdAt: Date;

  @property({type: 'date', required: true, defaultFn: 'now'})
  updatedAt: Date;

  constructor(data?: Partial<AdminLog>) {
    super(data);
  }
}

export interface AdminLogRelations {}
export type AdminLogWithRelations = AdminLog & AdminLogRelations;
