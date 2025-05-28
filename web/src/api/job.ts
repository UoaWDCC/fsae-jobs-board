import { apiInstance } from "@/api/ApiInstance";
import { Job } from "@/models/job.model";

// TODO : 
// [] Filter
// [] Pagination
// [] Sorting
// [] Search

// Using the API class to fetch jobs
export async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await apiInstance.get("job");
    // Return the data as an array of Job objects
    return res.data as Job[];
  } catch (e) {
    throw Error("An unknown error occurred trying to fetch jobs");
  }
}

// Using the API class to fetch jobs
export async function fetchJobById(id: string): Promise<Job | null> {
  try {
    const res = await apiInstance.get(`job/${id}`);
    // Return the data as Job
    return res.data as Job;
  } catch (e) {
    throw Error(`An unknown error occurred trying to fetch job details by id: ${id}`);
  }
}

export async function fetchJobsByPublisherId(publisherId: string): Promise<Job[]> {
  try {
    const filter = {
      where: {
        publisherID: publisherId,
      }
    };
    const res = await apiInstance.get("job");
    // Return the data as an array of Job objects
    return res.data as Job[];
  } catch (e) {
    throw Error("An unknown error occurred trying to fetch jobs");
  }
}