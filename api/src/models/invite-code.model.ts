import { Entity, model, property } from '@loopback/repository';

@model()
export class InviteCode extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
        required: true,
        index: {
            unique: true,
        },
    })
    code: string;

    @property({
        type: 'boolean',
        required: true,
        default: true,
    })
    isActive: boolean;

    @property({
        type: 'number',
        required: false,
        default: 1,
    })
    maxUses?: number; // null/undefined means unlimited

    @property({
        type: 'number',
        required: true,
        default: 0,
    })
    useCount: number;

    @property({
        type: 'date',
        required: true,
        default: () => new Date(),
    })
    createdAt: Date;

    constructor(data?: Partial<InviteCode>) {
        super(data);
    }
}

export interface InviteCodeRelations {
    // define navigational properties here if needed
}

export type InviteCodeWithRelations = InviteCode & InviteCodeRelations;
