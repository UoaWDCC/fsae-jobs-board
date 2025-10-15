import { model, property } from '@loopback/repository';
import { JobType } from '../../models/job-type';
import { Education } from '../../models/education.model';

// DTO = Data Transfer Object (the schema of an object that a route takes as a request body)

@model()
export class CreateFsaeUserDTO {
  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;

  @property({
    type: 'string',
    required: true
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: false
  })
  avatarURL?: string;

  @property({
    type: 'string',
    required: false
  })
  bannerURL?: string;

  @property({
    type: 'string',
    required: false
  })
  description?: string;

  @property({
    type: 'string',
    required: false
  })
  inviteCode?: string;
}

@model()
export class CreateAdminDTO extends CreateFsaeUserDTO {
  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;
}

@model()
export class CreateMemberDTO extends CreateFsaeUserDTO {
  @property({
    type: 'string',
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
    required: false,
    jsonSchema: {
      enum: Object.values(JobType),
    },
  })
  lookingFor?: JobType;

  @property({
    type: 'array',
    itemType: Education,
    required: false
  })
  education?: Education[];

  @property({
    type: 'array',
    itemType: 'string',
    required: false
  })
  skills?: string[];
}

@model()
export class CreateSponsorDTO extends CreateFsaeUserDTO {
  @property({
    type: 'string',
    required: true
  })
  companyName: string;

  @property({
    type: 'string',
    required: false
  })
  websiteURL?: string;

  @property({
    type: 'string',
    required: false
  })
  industry?: string;
}

@model()
export class CreateAlumniDTO extends CreateFsaeUserDTO {
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
    required: false
  })
  companyName?: string;
}