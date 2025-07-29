export interface Sponsor {
  "id": string,
  "email": string,
  "activated": boolean,
  "verified": boolean,
  "fsaeRole": string,
  "firstName": string,
  "lastName": string,
  "phoneNumber": string,
  "desc": string | null,
  "logo": string | null,
  "websiteURL": string | null,
  "tier": string | null,
  "name": string | null,
  "industry": string | null,
  "company": string | null
}
