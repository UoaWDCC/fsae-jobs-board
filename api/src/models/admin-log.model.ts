import {Entity, model, property} from '@loopback/repository';

export interface AdminLogDetails {
  message: string;
  [key: string]: string; // allows any other string fields
}

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

  // Details stores details about the log in a semi-structured manner
  // The details object is required to have a string message field, but can 
  // also have any arbitrary string fields as well to be displayed
  // alongside the message
  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      type: 'object',
      properties: {
        message: {type: 'string'},
      },
      additionalProperties: {type: 'string'}, // any extra keys must also be string
      required: ['message'],
    },
  })
  details: AdminLogDetails;

  @property({
    type: 'date', 
    required: true,
    defaultFn: 'now'
  })
  createdAt: Date;

  @property({
    type: 'date', 
    required: true,
    defaultFn: 'now'
  })
  updatedAt: Date;

  constructor(data?: Partial<AdminLog>) {
    super(data);
  }
}

export interface AdminLogRelations {
}

export type AdminLogWithRelations = AdminLog & AdminLogRelations;
