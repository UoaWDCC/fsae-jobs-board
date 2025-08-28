import { apiInstance } from "@/api/ApiInstance";
import { Job } from "@/models/job.model";
import { JobCardProps } from "@/app/components/JobCardCarousel/JobCard";

// TODO : 
// [] Filter - Carl - Done
// [] Pagination - Carl - Done
// [] Sorting - Carl - Sorts with job upload date, not alphabetical. Double check with Ben what type of sorting is needed.
// [] Search - Carl - Done

// Using the API class to fetch jobs
export async function fetchJobs(search?: string): Promise<Job[]> {
  try {
    const res = await apiInstance.get("job", {
      params: search ? { search } : {},
    });
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

// Create a new job
export async function createJob(jobData: Omit<Job, 'id' | 'publisherID'>): Promise<Job> {
  try {
    const res = await apiInstance.post('job', jobData);
    return res.data as Job;
  } catch (e) {
    throw Error('An unknown error occurred trying to create job');
  }
}

// Update an existing job
export async function updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
  try {
    const res = await apiInstance.patch(`job/${id}`, jobData);
    return res.data as Job;
  } catch (e) {
    throw Error(`An unknown error occurred trying to update job: ${id}`);
  }
}

// Delete a job
export async function deleteJob(id: string): Promise<void> {
  try {
    await apiInstance.delete(`job/${id}`);
  } catch (e) {
    throw Error(`An unknown error occurred trying to delete job: ${id}`);
  }
}

// Utility function to convert Job model to JobCardProps
export function convertJobToCardProps(job: Job): JobCardProps {
  return {
    id: job.id,
    title: job.title,
    specialisation: job.specialisation,
    description: job.description,
    roleType: job.roleType ?? "Unknown",
    salary: job.salary,
    applicationDeadline: job.applicationDeadline,
    datePosted: job.datePosted,
    publisherID: job.publisherID,
  };
}

// Utility function to load jobs with error handling
export async function loadJobsWithErrorHandling(): Promise<Job[]> {
  try {
    const fetchedJobs = await fetchJobs();
    return fetchedJobs;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return [];
  }
}