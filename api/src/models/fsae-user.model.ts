import {Entity, model, property} from '@loopback/repository';
import {FsaeRole} from './roles';
import {AdminStatus} from './admin.status';
import {securityId, UserProfile} from '@loopback/security';

@model({settings: {strict: false}})
export class FsaeUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(FsaeRole),
    },
  })
  role: FsaeRole;

  // Common fields
  @property({type: 'string', required: true})
  email: string;
  
  @property({
    type: 'string',
    required: true,
  })
  username: string='FsaeUser'; 

  @property({type: 'string', required: true, hidden: true})
  password: string;

  @property({type: 'boolean', required: true})
  activated: boolean;

  @property({type: 'boolean', required: true})
  verified: boolean;

  @property({type: 'string', value: ''}) 
  phoneNumber?: string;

  @property({
    type: 'string',
    required: false,
  })
  desc?: string;

  @property({
    type: 'string',
    required: true,
    default: "-",
  })
  avatar: string='/default-avatar.png'; // TODO: set it to default avatar URL

  /* Role-specific optional fields
  Member: firstName, lastName, cv, subGroup;
  Alumni: firstName, lastName, subGroup, company;
  Sponsor: company, websiteURL, tier, industry, name;
  these fields are optional and redefined in the derived classes
  */
  @property({
    type: 'string',
    default: 'Fsae',
  }) 
  firstName?: string; //member/Alumni
  
  @property({
    type: 'string', 
    default: 'member',
  }) 
  lastName?: string; //member/Alumni
  @property({type: 'string'}) cv?: string; // Member
  @property({type: 'string'}) subGroup?: string; // Member/Alumni
  @property({type: 'string'}) company?: string; // Alumni/Sponsor
  @property({type: 'string'}) websiteURL?: string; // Sponsor
  @property({type: 'string'}) tier?: string; // Sponsor
  @property({type: 'string'}) industry?: string; // Sponsor
  @property({type: 'string'}) name?: string; // Sponsor

  @property({
    type: 'string',
    required: true,
    default: AdminStatus.PENDING,
  })
  adminStatus: AdminStatus;

  @property({
    type: 'date', 
    defaultFn: 'now'
  })
  createdAt: Date;

  public convertToSecurityUserProfile(): UserProfile {
    return {
      [securityId]: this.id as string,
      name: this.username ?? '',
      email: this.email,
    };
  }
}

export interface FsaeUserRelations {
  // describe navigational properties here
}

export type FsaeUserWithRelations = FsaeUser & FsaeUserRelations;