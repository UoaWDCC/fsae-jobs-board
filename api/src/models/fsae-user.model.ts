import {Entity, model, property} from '@loopback/repository';
import {FsaeRole} from './roles';
import {AdminStatus} from './admin.status';

@model()
export class FsaeUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string; // Unique generated ID

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(FsaeRole),
    },
    default: FsaeRole.UNKNOWN
  })
  role: FsaeRole;

  @property({
    type: 'string', 
    required: true
  })
  email: string; 

  @property({
    type: 'string', 
    required: true, 
    hidden: true
  })
  password: string; // Hashed

  @property({
    type: 'boolean', 
    required: true,
    default: true
  })
  activated: boolean;

  @property({
    type: 'boolean', 
    required: true,
    default: false
  })
  verified: boolean;

  @property({
    type: 'string', 
    required: true,
    default: ""
  }) 
  phoneNumber: string;

  @property({
    type: 'string',
    required: false,
    default: ""
  })
  description: string;

  @property({
    type: 'string',
    required: true,
    default: "/default_avatar.png"
  })
  avatarURL: string;

  @property({
    type: 'string',
    required: true,
    default: "/default_banner.png"
  })
  bannerURL: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(AdminStatus),
    },
    default: AdminStatus.PENDING
  })
  adminStatus: AdminStatus;

  @property({
    type: 'date', 
    required: true,
    defaultFn: 'now'
  })
  createdAt: Date;
}