import { apiInstance } from "@/api/ApiInstance";
import { Member } from "@/models/member.model";
import { MemberListEntry } from "@/models/memberlistentry.model";

export async function fetchMembers(): Promise<Member[]> {
  try {
    const res = await apiInstance.get("user/member");
    // Return the data as Member[]
    return res.data as Member[];
  } catch (e) {
    throw Error("An unknown error occurred trying to fetch members profiles.");
  }
}

export async function fetchMemberById(id: string): Promise<Member | null> {
  try {
    const res = await apiInstance.get(`user/member/${id}`);
    // Return the data as Member
    return res.data as Member;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch member profile by id: ${id}\n${e}`);
  }
}

export async function editMemberById(id: string, newMember: Partial<Member>) {
  console.log(newMember)
  try {
    await apiInstance.patch(`user/member/${id}`, newMember);
  } catch (e) {
    throw Error(`An unknown error occurred trying to edit member profile by id: ${id}\n${e}`);
  }
}

export async function fetchMemberList(lookingFor?: string, subGroup?: string): Promise<MemberListEntry[]> {
  try {
    const params: any = {};
    if (lookingFor) params.lookingFor = lookingFor;
    if (subGroup) params.subGroup = subGroup;

    const res = await apiInstance.get("user/member", { params });
    return res.data as MemberListEntry[];
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch member list: ${e}`);
  }
}