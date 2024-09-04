export enum Role {
  Student = 'student',
  Sponsor = 'sponsor',
  Alumni = 'alumni',
}

export function roleToString(role: Role): string {
  return role;
}

export function stringToRole(value: string): Role | undefined {
  return Object.values(Role).includes(value as Role) ? (value as Role) : undefined;
}

export function stringsToRoles(values: string[]): Role[] {
  return values
    .map((value) => stringToRole(value))
    .filter((role): role is Role => role !== undefined);
}
