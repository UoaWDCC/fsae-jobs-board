import {model, property} from '@loopback/repository';
import { FsaeRole } from '../models';

@model()
export class SponsorProfileDto {
    @property({type: 'string'}) id: string;
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
    @property({type: 'string'}) company?: string;
    @property({type: 'string'}) websiteURL?: string;
    @property({type: 'string'}) tier?: string;
    @property({type: 'string'}) industry?: string;
    @property({type: 'string'}) name?: string;
    //Thinking of having the createdAt field as well for potential future use.
}

export const SponsorProfileDtoFields = Object.fromEntries(
    Object.keys(new SponsorProfileDto()).map(k => [k, true])
);