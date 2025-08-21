import { apiInstance } from "@/api/ApiInstance";
import { Sponsor } from "@/models/sponsor.model";

export async function fetchSponsors(): Promise<Sponsor[]> {
  try {
    const res = await apiInstance.get("user/sponsor");
    // Return the data as Sponsor[]
    return res.data as Sponsor[];
  } catch (e) {
    throw Error("An unknown error occurred trying to fetch sponsors profiles.");
  }
}

export async function fetchSponsorById(id: string): Promise<Sponsor | null> {
  try {
    const res = await apiInstance.get(`user/sponsor/${id}`);
    // Return the data as Sponsor
    return res.data as Sponsor;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch sponsor profile by id: ${id}`);
  }
}

export async function editSponsorById(id: string, newSponsor: Partial<Sponsor>) {
  try {
    await apiInstance.patch(`user/sponsor/${id}`, newSponsor);
  } catch (e) {
    throw Error(`An unknown error occurred trying to edit sponsor profile by id: ${id}`);
  }
}