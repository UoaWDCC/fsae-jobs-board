import {model, property} from '@loopback/repository';
import {FsaeRole} from '../models';
import {SubGroup} from '../models/subgroup.model';

@model()
export class AlumniProfileDto {
  @property({type: 'string'}) id: string;

  @property({type: 'string'}) email: string;

  @property({type: 'string'}) phoneNumber?: string;

  @property({type: 'string'}) description?: string;

  @property({type: 'string'}) avatarURL?: string;

  @property({type: 'string'}) bannerURL?: string;

  @property({type: 'string'}) role: FsaeRole;

  @property({type: 'string'}) firstName: string; 

  @property({type: 'string'}) lastName: string; 

  @property({
    type: 'string',
    jsonSchema: {enum: Object.values(SubGroup)},
    default: SubGroup.UNKNOWN,
  })
  subGroup?: SubGroup; 

  @property({type: 'string'}) companyName?: string; 
}

export const AlumniProfileDtoFields = Object.fromEntries(
  Object.keys(new AlumniProfileDto()).map(k => [k, true]),
);
