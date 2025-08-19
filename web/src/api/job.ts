import { apiInstance } from "@/api/ApiInstance";
import { Job } from "@/models/job.model";

export async function fetchJobs(search?: string): Promise<Job[]> {
  try {
    console.log('[api/job] fetchJobs search=', search);
    const res = await apiInstance.get('job', { params: search ? { search } : {} });
    return res.data as Job[];
  } catch (e) {
    console.error('[api/job] fetchJobs error', e);
    throw Error('An unknown error occurred trying to fetch jobs');
  }
}

export async function fetchJobById(id: string): Promise<Job | null> {
  try {
    console.log('[api/job] fetchJobById', id);
    const res = await apiInstance.get(`job/${id}`);
    return res.data as Job;
  } catch (e) {
    console.error('[api/job] fetchJobById error', e);
    throw Error(`An unknown error occurred trying to fetch job details by id: ${id}`);
  }
}

export async function fetchJobsByPublisherId(publisherId: string): Promise<Job[]> {
  try {
    console.log('[api/job] fetchJobsByPublisherId', publisherId);
    const res = await apiInstance.get(`job?filter[where][publisherID]=${publisherId}`);
    return res.data as Job[];
  } catch (e) {
    console.error('[api/job] fetchJobsByPublisherId error', e);
    throw Error('An unknown error occurred trying to fetch jobs');
  }
}