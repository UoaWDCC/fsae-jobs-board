import { Education } from "./education.model";
import { FsaeUser } from "./fsae-user.model";
import { JobType } from "./job-type";
import { SubGroup } from "./subgroup.model";

export interface Member extends FsaeUser{
  firstName: string;
  lastName: string;
  lookingFor: JobType;
  subGroup: SubGroup;
  education: Education[];
  skills: string[];
  cvData: Buffer;
  cvFileName: string;
  cvMimeType: string;
  cvSize: number;
  cvUploadedAt: Date;
  hasCV: boolean;
}
