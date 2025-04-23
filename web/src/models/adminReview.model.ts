import { UserType } from '@/app/features/user/userSlice';
import { Status } from '@/app/type/status';

export interface AdminReview {
  id: string;
  name: string;
  userType: UserType;
  date: Date;
  status: Status;
}
