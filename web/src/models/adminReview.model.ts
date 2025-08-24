import {Role} from '@/app/type/role';
import {Status} from '@/app/type/status';

export type AdminReview = {
  id: string;
  name: string;
  role: Role;
  date: Date;
  status: Status;
  contact: string;
  email: string;
  intention?: string;
};
