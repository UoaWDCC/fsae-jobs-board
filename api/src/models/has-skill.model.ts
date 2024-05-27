import {Entity, model, property} from '@loopback/repository';

@model()
export class HasSkill extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  memberID: string;

  @property({
    type: 'string',
    required: true,
  })
  skillID: string;


  constructor(data?: Partial<HasSkill>) {
    super(data);
  }
}

export interface HasSkillRelations {
  // describe navigational properties here
}

export type HasSkillWithRelations = HasSkill & HasSkillRelations;
