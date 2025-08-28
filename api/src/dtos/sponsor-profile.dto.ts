import {model, property} from '@loopback/repository';
import {FsaeRole} from '../models';

@model()
export class SponsorProfileDto {
  @property({type: 'string'}) id: string;

  @property({type: 'string'}) email: string;

  @property({type: 'string'}) phoneNumber?: string;

  @property({type: 'string'}) description?: string;

  @property({type: 'string'}) avatarURL?: string;

  @property({type: 'string'}) bannerURL?: string;

  @property({type: 'string'}) role: FsaeRole;

  @property({type: 'string'}) companyName: string;

  @property({type: 'string'}) websiteURL?: string;

  @property({type: 'string'}) industry?: string;
}

export const SponsorProfileDtoFields = Object.fromEntries(
  Object.keys(new SponsorProfileDto()).map(k => [k, true]),
);
