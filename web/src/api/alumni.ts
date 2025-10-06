import { apiInstance } from "@/api/ApiInstance";
import { Alumni } from "@/models/alumni.model";

export async function fetchAlumni(): Promise<Alumni[]> {
  try {
    const res = await apiInstance.get("user/alumni");
    // Return the data as Alumni[]
    return res.data as Alumni[];
  } catch (e) {
    throw Error("An unknown error occurred trying to fetch alumni profiles.");
  }
}

export async function fetchAlumniById(id: string): Promise<Alumni | null> {
  try {
    const res = await apiInstance.get(`user/alumni/${id}`);
    // Return the data as Alumni
    return res.data as Alumni;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch alumni profile by id: ${id}`);
  }
}

export async function editAlumniById(id: string, newAlumni: Partial<Alumni>) {
  try {
    await apiInstance.patch(`user/alumni/${id}`, newAlumni);
  } catch (e) {
    throw Error(`An unknown error occurred trying to edit alumni profile by id: ${id}`);
  }
}