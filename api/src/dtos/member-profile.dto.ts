import {model, property} from '@loopback/repository';
import {FsaeRole} from '../models';
import {JobType} from '../models/job-type';
import {Education} from '../models/education.model';
import {SubGroup} from '../models/subgroup.model';

@model()
export class MemberProfileDto {
  @property({type: 'string'}) id: string;

  @property({type: 'string'}) email: string;

  @property({type: 'string'}) phoneNumber?: string;

  @property({type: 'string'}) description?: string;

  @property({type: 'string'}) avatarURL?: string;

  @property({type: 'string'}) bannerURL?: string;

  @property({type: 'string'}) role: FsaeRole;

  @property({
    type: 'string',
    jsonSchema: {enum: Object.values(JobType)},
    default: JobType.NOT_FOR_HIRE,
  })
  lookingFor: JobType;

  @property({
    type: 'string',
    jsonSchema: {enum: Object.values(SubGroup)},
    default: SubGroup.UNKNOWN,
  })
  subGroup: SubGroup;

  @property({type: 'array', itemType: 'string', default: []})
  skills?: string[];

  @property({type: 'array', itemType: Education, default: []})
  education?: Education[];

  @property({type: 'string'}) firstName?: string;

  @property({type: 'string'}) lastName?: string;

  @property({type: 'string'}) avatar?: string;

  // CV metadata
  @property({type: 'string'}) cvFileName?: string;
  @property({type: 'string'}) cvMimeType?: string;
  @property({type: 'number'}) cvSize?: number;
  @property({type: 'date'}) cvUploadedAt?: Date;
  @property({type: 'boolean'}) hasCV?: boolean;
}

export const MemberProfileDtoFields = Object.fromEntries(
  Object.keys(new MemberProfileDto()).map(k => [k, true]),
);
