import {Entity, model, property} from '@loopback/repository';

@model()
export class Member extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  memberID?: number;

  @property({
    type: 'number',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  cv: string;

  @property({
    type: 'string',
    required: true,
  })
  subGroup: string;

  @property({
    type: 'string',
    required: true,
  })
  photo: string;


  constructor(data?: Partial<Member>) {
    super(data);
  }
}

export interface MemberRelations {
  // describe navigational properties here
}

export type MemberWithRelations = Member & MemberRelations;
