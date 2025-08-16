import { FsaeUser } from "./fsae-user.model";

export interface Alumni extends FsaeUser{
  firstName: string;
  lastName: string;
  companyName: string;
}
