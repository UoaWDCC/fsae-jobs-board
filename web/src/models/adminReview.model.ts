import { Role } from '@/app/type/role';
import { Status } from '@/app/type/status';

export interface AdminReview {
  id: string;
  name: string;
  role: Role;
  date: Date;
  status: Status;
}
