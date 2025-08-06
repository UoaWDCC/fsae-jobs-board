import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';
import { JobType } from './job-type';
import { Education } from './education.model';

@model()
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
  })
  lookingFor: JobType;

  @property({
    type: 'array',
    itemType: Education,
    required: true,
    default: [],
  })
  education: Education[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    default: []
  })
  skills: string[];

  /*
    The following CV properties (cvData, cvFileName, cvMimeType, cvSize, cvUploadedAt and hasCV)
    may be subject to change in the future (it would be desireable to store CVs in some way other
    than embedding them in the Member model)
    All of these CV properties (except for hasCV) are left as optional in the model.
  */
  @property({
    type: 'buffer',
    mongodb: { dataType: 'binData' },
  })
  cvData?: Buffer;

  @property({
    type: 'string',
    default: '',
  })
  cvFileName?: string;

  @property({
    type: 'string',
    default: '',
  })
  cvMimeType?: string;

  @property({
    type: 'number',
    default: 0,
  })
  cvSize?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  cvUploadedAt?: Date;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  hasCV: boolean;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}