import { apiInstance } from "@/api/ApiInstance";
import { Member } from "@/models/member.model";

export async function fetchMemberById(id: string): Promise<Member | null> {
  try {
    const res = await apiInstance.get(`user/member/${id}`);
    // Return the data as Member
    return res.data as Member;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch member profile by id: ${id}`);
  }
}

export async function editMemberById(id: string, newMember: Partial<Member>) {
  try {
    await apiInstance.patch(`user/member/${id}`, newMember);
  } catch (e) {
    throw Error(`An unknown error occurred trying to edit member profile by id: ${id}`);
  }
}