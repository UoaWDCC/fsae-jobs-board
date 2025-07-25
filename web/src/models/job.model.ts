// This file defines the Job interface, which represents a job posting.
// It includes properties such as id, title, applicationDeadline, applicationLink, datePosted,
// specialisation, description, salary, and publisherID.
// The Job interface is used in the JobListing component to manage job postings.
export interface Job {
    id: string;
    title: string;
    applicationDeadline: string;
    applicationLink: string;
    datePosted: string;
    specialisation: string;
    description: string;
    salary: string;
    publisherID: string;
    roleType: string; 
    startDate?: string;
    duration?: string;
    location?: string;
    skills?: string[];
    qualifications?: string[];
}

//carl: fixed and added missing fields to the Job interface

//! If this changes, make sure to update the JobDetail component in web/src/app/components/JobDetail/JobDetail.tsx