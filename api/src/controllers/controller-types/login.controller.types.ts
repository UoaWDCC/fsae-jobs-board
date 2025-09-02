export type loginParams = {
  email: string;
  password: string;
}

export type loginResponse = {
  userId: string,
  token: string,
  verified: boolean;
  hasMissingInfo?: boolean;
}

export type whoAmIResponse = {
  id: string,
  firstName?: string,
  lastName?: string,
  email: string,
  role: string,
}