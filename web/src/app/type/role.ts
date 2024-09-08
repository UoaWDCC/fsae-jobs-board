export enum Role {
  Student = 'student',
  Sponsor = 'sponsor',
  Alumni = 'alumni',
  Admin = 'admin',
  Member = 'member',
  Unknown = 'Unknown' // Fallback in case error
}

export function stringToRole(roleString) {
  const roleKey = Object.keys(Role).find(key => Role[key] === roleString);
  return roleKey ? Role[roleKey] : Role.Unknown;
}
