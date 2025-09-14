export interface Member {
  "id": string,
  "email": string,
  "activated": boolean,
  "verified": boolean,
  "role": string
  "firstName": string,
  "lastName": string,
  "phoneNumber": string,
  "desc": string,
  "memberID": string | null,
  "hasCV": string | null,
  "subGroup": string | null,
  "photo": string | null,

  "education" : string[] | null, // not in the database model yet
  "skills" : string[] | null, // not in the database model yet
}
