import { UserType } from '../features/user/userSlice';
import { Status } from '../type/status';

export interface AdminReview {
  id: string;
  name: string;
  userType: UserType;
  date: Date;
  status: Status;
}
