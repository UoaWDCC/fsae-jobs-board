export enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

function getStatusString(status: Status): string {
  return status;
}

function getStatusEnum(status: string): Status | undefined {
  return Object.values(Status).find((value) => value === status);
}