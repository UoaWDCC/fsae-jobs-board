import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model()
export class Sponsor extends FsaeUser {
  @property({
    type: 'string', 
    required: true
  })
  companyName: string;

  @property({
    type: 'string', 
    required: false, // "required: true" demands non-empty strings, so it is turned off here
    default: ""
  })
  websiteURL: string;


  @property({
    type: 'string', 
    required: false, // "required: true" demands non-empty strings, so it is turned off here
    default: ""
  })
  industry: string;
  
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

  constructor(data?: Partial<Sponsor>) {
    super(data);
  }
}