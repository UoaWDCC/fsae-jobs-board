import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model()
export class Admin extends FsaeUser {
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
  
  constructor(data?: Partial<Admin>) {
    super(data);
  }
}
