import {Entity, model, property} from '@loopback/repository';

@model()
export class Skill extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  skillName: string;


  constructor(data?: Partial<Skill>) {
    super(data);
  }
}

export interface SkillRelations {
  // describe navigational properties here
}

export type SkillWithRelations = Skill & SkillRelations;
