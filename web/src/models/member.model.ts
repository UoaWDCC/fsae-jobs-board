import { Education } from "./education.model";
import { FsaeUser } from "./fsae-user.model";
import { JobType } from "./job-type";

export interface Member extends FsaeUser{
  firstName: string;
  lastName: string;
  lookingFor: JobType;
  education: Education[];
  skills: string[];
  cvData: Buffer;
  cvFileName: string;
  cvMimeType: string;
  cvSize: number;
  cvUploadedAt: Date;
  hasCV: boolean;
}
