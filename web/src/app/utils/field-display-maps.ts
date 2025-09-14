import { JobType } from "@/models/job-type"
import { SubGroup } from "@/models/subgroup.model"

export const jobTypeDisplayMap: Record<JobType, string> = {
  [JobType.GRAD_ROLE]: "Graduate Role",
  [JobType.INTERNSHIP]: "Internship",
  [JobType.PART_TIME]: "Part-time work",
  [JobType.NOT_FOR_HIRE]: "None"
}

export const subGroupDisplayMap: Record<SubGroup, string> = {
  [SubGroup.UNKNOWN]: "Team Member",
  [SubGroup.BUSINESS]: "Business Team",
  [SubGroup.COMPOSITES]: "Composites Team",
  [SubGroup.MECHANICAL]: "Mechanical Team",
  [SubGroup.ELECTRICAL]: "Electrical Team",
  [SubGroup.AUTONOMOUS]: "Autonomous Team",
  [SubGroup.RACE_TEAM]: "Race Team",
}