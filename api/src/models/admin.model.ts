import {Entity, model, property} from '@loopback/repository';
import {FsaeUser} from './fsae-user.model';

@model()
export class Admin extends FsaeUser {

  
  constructor(data?: Partial<Admin>) {
    super(data);
  }
}
