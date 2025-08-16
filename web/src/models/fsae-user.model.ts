import { AdminStatus } from "./admin.status";
import { FsaeRole } from "./roles";

export interface FsaeUser {
  id: string;
  role: FsaeRole;
  email: string; 
  activated: boolean;
  verified: boolean;
  phoneNumber: string;
  description: string;
  avatarURL: string;
  bannerURL: string;
  adminStatus: AdminStatus;
  createdAt: Date;
}
