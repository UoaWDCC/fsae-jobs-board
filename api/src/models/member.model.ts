import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';
import { JobType } from './job-type';
import { Education } from './education.model';
import { SubGroup } from './subgroup.model';

@model({settings: {strict: false}})
export class Member extends FsaeUser {
  @property({
    type: 'string', 
    required: true
  })
  firstName: string;

  @property({
    type: 'string', 
    required: true
  })
  lastName: string;

  @property({
    type: 'string', 
    required: true,
    jsonSchema: {
      enum: Object.values(JobType),
    },
    default: JobType.NOT_FOR_HIRE
  })
  lookingFor: JobType;

  @property({
    type: 'string', 
    required: true,
    jsonSchema: {
      enum: Object.values(SubGroup),
    },
    default: SubGroup.UNKNOWN
  })
  subGroup: SubGroup;

  @property({
    type: 'array',
    itemType: Education,
    required: false, // "required: true" demands non-empty arrays, so it is turned off here
    default: [],
  })
  education: Education[];

  @property({
    type: 'array',
    itemType: 'string',
    required: false, // "required: true" demands non-empty arrays, so it is turned off here
    default: []
  })
  skills: string[];

  /*
    The following CV properties (cvData, cvFileName, cvMimeType, cvSize, cvUploadedAt and hasCV)
    may be subject to change in the future (it would be desireable to store CVs in some way other
    than embedding them in the Member model)
  */

  @property({
    type: 'string',
    default: '',
  })
  cvS3Key: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  hasCV?: boolean;

  @property({
    type: 'string',
    default: '',
  })
  avatarS3Key: string;

  @property({
    type: 'string',
    default: '',
  })
  bannerS3Key: string;
  
  // firstName, lastName, and subGroup are already defined in parent FsaeUser class with @property decorators
  // Default values are set in the parent class or during registration

 
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}