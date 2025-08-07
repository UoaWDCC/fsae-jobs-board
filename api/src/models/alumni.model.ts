import {model, property} from '@loopback/repository';
import {FsaeUser} from './index';

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
    default: ""
  })
  companyName: string;

  constructor(data?: Partial<Alumni>) {
    super(data);
  }
}
