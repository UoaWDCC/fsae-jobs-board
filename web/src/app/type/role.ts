export enum Role {
  Student = 'student',
  Sponsor = 'sponsor',
  Alumni = 'alumni',
  Admin = 'admin',
  Member = 'member',
  Unknown = 'unknown' // Fallback in case error
}

export function stringToRole(roleString: any): Role {
  const roleKey = Object.keys(Role).find(key => Role[key as keyof typeof Role] === roleString) as keyof typeof Role | undefined;
  return roleKey ? Role[roleKey] : Role.Unknown;
}

export function roleToString(role: Role): string {
  return role;
}

export function stringsToRoles(values: string[]): Role[] {
  return values
    .map((value) => stringToRole(value))
    .filter((role): role is Role => role !== undefined);
}
