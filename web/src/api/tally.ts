import { apiInstance } from "@/api/ApiInstance";

// Types for Tally API responses
export interface TallyFormResponse {
  form_id: string;
  tally_form_id: string;
  edit_url: string;
  embed_code: string;
  preview_url: string;
}

export interface TallyApplicationFormResponse {
  has_form: boolean;
  embed_url?: string;
  embed_code?: string;
  already_applied?: boolean;
  submission_date?: string;
}

export interface TallySubmission {
  id: string;
  job_id: string;
  job_title: string;
  submitted_at: string;
  form_title: string;
}

export interface ApplicantSubmissionsResponse {
  submissions: TallySubmission[];
  total_count: number;
}

export interface FormSubmission {
  id: string;
  member_id: string;
  member_email: string;
  tally_response_id: string;
  submitted_at: string;
  status: string;
  response_data: Record<string, any>;
}

export interface FormSubmissionsResponse {
  submissions: FormSubmission[];
  total_count: number;
}

// Create Tally form for a job
export async function createJobForm(
  jobId: string,
  formData: {
    name?: string;
    status?: string;
    blocks?: any[];
  } = {}
): Promise<TallyFormResponse> {
  try {
    const res = await apiInstance.post(
      `/api/sponsors/jobs/${jobId}/form`,
      {
        name: formData.name,
        status: formData.status || 'PUBLISHED',
        blocks: formData.blocks || [],
      }
    );
    return res.data as TallyFormResponse;
  } catch (e: any) {
    throw Error(
      `Failed to create form: ${e.response?.data?.error?.message || e.message}`
    );
  }
}

// Get job application form (for members applying)
export async function getJobApplicationForm(
  jobId: string
): Promise<TallyApplicationFormResponse> {
  try {
    const res = await apiInstance.get(`/api/jobs/${jobId}/apply`);
    return res.data as TallyApplicationFormResponse;
  } catch (e: any) {
    throw Error(
      `Failed to get application form: ${e.response?.data?.error?.message || e.message}`
    );
  }
}

// Get applicant's submission history (members and alumni)
export async function getApplicantSubmissions(
  applicantId: string
): Promise<ApplicantSubmissionsResponse> {
  try {
    const res = await apiInstance.get(`/api/applicants/${applicantId}/submissions`);
    return res.data as ApplicantSubmissionsResponse;
  } catch (e: any) {
    throw Error(
      `Failed to get applicant submissions: ${e.response?.data?.error?.message || e.message}`
    );
  }
}

// Get form submissions (for sponsors viewing applicants)
export async function getFormSubmissions(
  formId: string,
  statusFilter?: string
): Promise<FormSubmissionsResponse> {
  try {
    const queryParam = statusFilter ? `?status=${statusFilter}` : '';
    const res = await apiInstance.get(`/api/sponsors/forms/${formId}/submissions${queryParam}`);
    return res.data as FormSubmissionsResponse;
  } catch (e: any) {
    throw Error(
      `Failed to get form submissions: ${e.response?.data?.error?.message || e.message}`
    );
  }
}

// Update submission status
export async function updateSubmissionStatus(
  submissionId: string,
  status: string,
  notes?: string
): Promise<void> {
  try {
    await apiInstance.patch(`/api/sponsors/submissions/${submissionId}`, {
      status,
      notes,
    });
  } catch (e: any) {
    throw Error(
      `Failed to update submission status: ${e.response?.data?.error?.message || e.message}`
    );
  }
}

// Check if job has a form
export async function checkJobHasForm(jobId: string): Promise<boolean> {
  try {
    const res = await apiInstance.get(`/api/sponsors/jobs/${jobId}/form`);
    return res.data?.has_form || false;
  } catch (e: any) {
    // If endpoint returns 404, job doesn't have a form
    if (e.response?.status === 404) {
      return false;
    }
    throw Error(
      `Failed to check if job has form: ${e.response?.data?.error?.message || e.message}`
    );
  }
}

// Get form preview (for job creators)
export interface FormPreviewResponse {
  preview_embed_url: string;
  form_title: string;
  is_preview: boolean;
}

export async function getJobFormPreview(jobId: string): Promise<FormPreviewResponse> {
  try {
    const res = await apiInstance.get(`/api/sponsors/jobs/${jobId}/form/preview`);
    return res.data as FormPreviewResponse;
  } catch (e: any) {
    throw Error(
      `Failed to get form preview: ${e.response?.data?.error?.message || e.message}`
    );
  }
}
