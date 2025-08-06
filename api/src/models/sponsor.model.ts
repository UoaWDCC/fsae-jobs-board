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
    required: true,
    default: ""
  })
  websiteURL: string;

  @property({
    type: 'string', 
    required: true,
    default: ""
  })
  industry: string;

  constructor(data?: Partial<Sponsor>) {
    super(data);
  }
}