import { apiInstance } from "@/api/ApiInstance";
import { Alumni } from "@/models/alumni.model";

export async function fetchAlumniById(id: string): Promise<Alumni | null> {
  try {
    const res = await apiInstance.get(`alumni/${id}`);
    // Return the data as Job
    return res.data as Alumni;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch alumni profile by id: ${id}`);
  }
}