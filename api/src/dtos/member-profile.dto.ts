import {model, property} from '@loopback/repository';
import { FsaeRole } from '../models';

@model()
export class MemberProfileDto {
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
    @property({type: 'string'}) firstName?: string;
    @property({type: 'string'}) lastName?: string;
    @property({type: 'string'}) cv?: string;
    @property({type: 'string'}) subGroup?: string;
    //Thinking of having the createdAt field as well for potential future use.
}

export const MemberProfileDtoFields = Object.fromEntries(
    Object.keys(new MemberProfileDto()).map(k => [k, true])
);