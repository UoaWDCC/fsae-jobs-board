import { FsaeUser } from "./fsae-user.model";

export interface Sponsor extends FsaeUser{
  companyName: string;
  websiteURL: string;
  industry: string;
}
