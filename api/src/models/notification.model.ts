import {Model, model, property} from '@loopback/repository';
import {NotificationType} from './notification.type';

@model()
export class Notification extends Model {
  @property({type: 'string', id: true, generated: true})
  id?: string;
  @property({type: 'string', required: true}) issuer: string;
  @property({type: 'string', required: true}) title: string;
  @property({type: 'string', required: true}) msgBody: string;
  @property({type: 'string', required: true}) type: NotificationType;
  @property({type: 'boolean', required: true}) read: boolean;
  @property({
    type: 'date',
    required: true,
    defaultFn: 'now',
  })
  createdAt: Date;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}
