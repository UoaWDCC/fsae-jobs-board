import {Role} from '@/app/type/role';
import {Status} from '@/app/type/status';
import { FsaeRole } from './roles';

export type AdminReview = {
  id: string;
  name: string;
  role: FsaeRole;
  date: Date;
  status: Status;
  contact: string;
  email: string;
  intention?: string;
};
