import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

interface TallyFormCreateRequest {
  name?: string; // Form name/title
  status: string; // "PUBLISHED" or "DRAFT"
  blocks: Record<string, any>[];
  settings?: {
    submissionsLimit?: number;
    redirectOnCompletion?: string;
    password?: string;
  };
}

interface TallyFormBlock {
  uuid: string;
  type: string;
  groupUuid: string;
  groupType: string;
  payload: Record<string, any>;
}

interface TallyFormResponse {
  id: string;
  name: string;
  workspaceId: string;
  status: string;
  numberOfSubmissions: number;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TallySubmissionResponse {
  id: string;
  formId: string;
  submittedAt: string;
  responses: Array<{
    questionId: string;
    value: any;
  }>;
}

interface TallyWebhookCreateRequest {
  formId: string;
  url: string;
  signingSecret?: string;
  eventTypes: string[];
}

interface TallyWebhookResponse {
  id: string;
  formId: string;
  url: string;
  signingSecret?: string;
  eventTypes: string[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

@injectable({scope: BindingScope.TRANSIENT})
export class TallyService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.TALLY_API_KEY || '';
    this.baseUrl = 'https://api.tally.so';

    if (!apiKey) {
      console.warn('TALLY_API_KEY environment variable not set - Tally integration will not function');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.error('Tally API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          throw new HttpErrors.Unauthorized('Invalid Tally API key');
        }
        if (error.response?.status === 404) {
          throw new HttpErrors.NotFound('Tally resource not found');
        }
        if (error.response?.status >= 500) {
          throw new HttpErrors.InternalServerError('Tally API service unavailable');
        }
        throw new HttpErrors.BadRequest(error.response?.data?.message || 'Tally API request failed');
      }
    );
  }

  async createForm(formData: TallyFormCreateRequest): Promise<TallyFormResponse> {
    this.validateApiKey();
    try {
      const response: AxiosResponse<TallyFormResponse> = await this.client.post('/forms', formData);
      console.log(`Tally form created successfully. ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to create Tally form:', error);
      throw error;
    }
  }

  private validateApiKey(): void {
    if (!process.env.TALLY_API_KEY) {
      throw new HttpErrors.ServiceUnavailable('Tally integration not configured - missing TALLY_API_KEY');
    }
  }

  async getForm(formId: string): Promise<TallyFormResponse> {
    try {
      const response: AxiosResponse<TallyFormResponse> = await this.client.get(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get Tally form ${formId}:`, error);
      throw error;
    }
  }

  async updateForm(formId: string, formData: Partial<TallyFormCreateRequest>): Promise<TallyFormResponse> {
    try {
      const response: AxiosResponse<TallyFormResponse> = await this.client.patch(`/forms/${formId}`, formData);
      console.log(`Tally form ${formId} updated successfully`);
      return response.data;
    } catch (error) {
      console.error(`Failed to update Tally form ${formId}:`, error);
      throw error;
    }
  }

  async deleteForm(formId: string): Promise<void> {
    try {
      await this.client.delete(`/forms/${formId}`);
      console.log(`Tally form ${formId} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete Tally form ${formId}:`, error);
      throw error;
    }
  }

  async getSubmissions(formId: string, options?: {
    page?: number;
    limit?: number;
    status?: 'completed' | 'partial';
    startDate?: string;
    endDate?: string;
  }): Promise<{submissions: TallySubmissionResponse[], hasMore: boolean, totalCount: number}> {
    try {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.status) params.append('status', options.status);
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);

      const response = await this.client.get(`/forms/${formId}/submissions?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get submissions for form ${formId}:`, error);
      throw error;
    }
  }

  async getSubmission(formId: string, submissionId: string): Promise<TallySubmissionResponse> {
    try {
      const response: AxiosResponse<TallySubmissionResponse> = await this.client.get(
        `/forms/${formId}/submissions/${submissionId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get submission ${submissionId} for form ${formId}:`, error);
      throw error;
    }
  }

  async createWebhook(webhookData: TallyWebhookCreateRequest): Promise<TallyWebhookResponse> {
    try {
      const response: AxiosResponse<TallyWebhookResponse> = await this.client.post('/webhooks', webhookData);
      console.log(`Tally webhook created successfully. ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to create Tally webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await this.client.delete(`/webhooks/${webhookId}`);
      console.log(`Tally webhook ${webhookId} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete Tally webhook ${webhookId}:`, error);
      throw error;
    }
  }

  async getWebhooks(options?: {page?: number; limit?: number}): Promise<{
    webhooks: TallyWebhookResponse[];
    hasMore: boolean;
    totalCount: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await this.client.get(`/webhooks?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get Tally webhooks:', error);
      throw error;
    }
  }

  generateEmbedCode(formId: string, options?: {
    width?: string;
    height?: string;
    hideTitle?: boolean;
  }): string {
    const width = options?.width || '100%';
    const height = options?.height || '500px';
    const hideTitle = options?.hideTitle ? '&hideTitle=1' : '';

    return `<iframe
      src="https://tally.so/embed/${formId}?alignLeft=1&transparentBackground=1${hideTitle}"
      width="${width}"
      height="${height}"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      title="Job Application Form"
      allow="camera; microphone; geolocation">
    </iframe>`;
  }

  generatePreviewUrl(formId: string): string {
    return `https://tally.so/r/${formId}`;
  }

  generateEditUrl(formId: string): string {
    return `https://tally.so/forms/${formId}/edit`;
  }

  createBasicJobApplicationForm(jobTitle: string): TallyFormCreateRequest {
    return {
      status: 'PUBLISHED',
      blocks: [
        {
          uuid: this.generateUUID(),
          type: 'FORM_TITLE',
          groupUuid: this.generateUUID(),
          groupType: 'TEXT',
          payload: {
            html: `Apply for ${jobTitle}`,
          },
        },
        {
          uuid: this.generateUUID(),
          type: 'INPUT_TEXT',
          groupUuid: this.generateUUID(),
          groupType: 'QUESTION',
          payload: {
            isRequired: true,
            placeholder: 'Enter your full name',
          },
        },
        {
          uuid: this.generateUUID(),
          type: 'INPUT_EMAIL',
          groupUuid: this.generateUUID(),
          groupType: 'QUESTION',
          payload: {
            isRequired: true,
            placeholder: 'Enter your email address',
          },
        },
        {
          uuid: this.generateUUID(),
          type: 'INPUT_PHONE_NUMBER',
          groupUuid: this.generateUUID(),
          groupType: 'QUESTION',
          payload: {
            isRequired: false,
            placeholder: 'Enter your phone number',
          },
        },
        {
          uuid: this.generateUUID(),
          type: 'TEXTAREA',
          groupUuid: this.generateUUID(),
          groupType: 'QUESTION',
          payload: {
            isRequired: true,
            placeholder: 'Tell us about your interest and qualifications...',
          },
        },
        {
          uuid: this.generateUUID(),
          type: 'FILE_UPLOAD',
          groupUuid: this.generateUUID(),
          groupType: 'QUESTION',
          payload: {
            isRequired: true,
          },
        },
      ],
      settings: {
        redirectOnCompletion: `${process.env.FRONTEND_URL}/application-submitted`,
      },
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export const tallyServiceInstance = new TallyService();