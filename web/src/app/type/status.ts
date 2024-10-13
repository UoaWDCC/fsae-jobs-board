export enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export function statusToString(status: Status): string {
  return status;
}

export function stringToStatus(status: string): Status | undefined {
  return Object.values(Status).find((value) => value === status);
}

// Convert Array of Strings to Array of Status Enums
export function stringsToStatuses(statuses: string[]): Status[] {
  return statuses.map((value) => stringToStatus(value) ?? Status.Pending); // Default to Status.Pending if not found
}
