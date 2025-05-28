import { apiInstance } from "@/api/ApiInstance";
import { Sponsor } from "@/models/sponsor.model";

export async function fetchSponsorById(id: string): Promise<Sponsor | null> {
  try {
    const res = await apiInstance.get(`user/sponsor/${id}`);
    // Return the data as Sponsor
    return res.data as Sponsor;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch sponsor profile by id: ${id}`);
  }
}