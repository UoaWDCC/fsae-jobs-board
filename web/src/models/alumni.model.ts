import { FsaeUser } from "./fsae-user.model";
import { SubGroup } from "./subgroup.model";

export interface Alumni extends FsaeUser{
  firstName: string;
  lastName: string;
  subGroup: SubGroup;
  companyName: string;
}
