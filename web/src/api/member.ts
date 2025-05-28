import { apiInstance } from "@/api/ApiInstance";
import { Member } from "@/models/member.model";

export async function fetchMemberById(id: string): Promise<Member | null> {
  try {
    const res = await apiInstance.get(`user/member/${id}`);
    // Return the data as Alumni
    return res.data as Member;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch alumni profile by id: ${id}`);
  }
}