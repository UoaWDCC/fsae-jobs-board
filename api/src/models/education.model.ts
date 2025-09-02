import {Model, model, property} from '@loopback/repository';

@model()
export class Education extends Model {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id: string; // Unique generated ID

    @property({
        type: 'string', 
        required: true
    })
    schoolName: string;

    @property({
        type: 'string', 
        required: true
    })
    degreeName: string;

    @property({
        type: 'string', 
        required: true
    })
    major: string;

    @property({
        type: 'string',
        required: false
    })
    grade?: string;

    @property({
        type: 'string',
        required: true
    })
    startYear: string;

    @property({
        type: 'string',
        required: false
    })
    endYear?: string;

    constructor(data?: Partial<Education>) {
        super(data);
    }
}