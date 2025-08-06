import {model, property} from '@loopback/repository';
import { FsaeRole } from '../models';

@model()
export class AlumniProfileDto {
  @property({type: 'string'}) role: FsaeRole;
  @property({type: 'string'}) email: string;
  @property({type: 'string'}) username: string;
  @property({type: 'string', required: false, default: ''}) phoneNumber?: string;
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
  avatar: string;
  @property({type: 'string'}) firstName?: string;
  @property({type: 'string'}) lastName?: string;
  @property({type: 'string'}) subGroup?: string;
  @property({type: 'string'}) company?: string;

  
}

export const AlumniProfileDtoFields = Object.fromEntries(
  Object.keys(new AlumniProfileDto()).map(k => [k, true])
);