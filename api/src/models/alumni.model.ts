import {model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';
import { SubGroup } from './subgroup.model';

@model()
export class Alumni extends FsaeUser {
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
    required: false,
    jsonSchema: {
      enum: Object.values(SubGroup),
    },
    default: SubGroup.UNKNOWN
  })
  subGroup: SubGroup;

  @property({
    type: 'string', 
    required: false,
    default: ""
  })
  companyName: string;

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

  constructor(data?: Partial<Alumni>) {
    super(data);
  }
}
