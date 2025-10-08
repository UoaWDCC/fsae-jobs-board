import {repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  put,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {UserProfile} from '@loopback/security';
import {FsaeRole} from '../models';
import {
  TallyFormRepository,
  TallyWebhookRepository,
  JobAdRepository,
  TallySubmissionRepository,
  ApplicationNonceRepository,
  MemberRepository,
} from '../repositories';
import {TallyService} from '../services/tally.service';
import {validateCreateFormRequest} from '../middleware/tally-validation.middleware';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

interface TallyBlock {
  uuid: string;
  type: string;
  groupUuid: string;
  groupType: string;
  payload: Record<string, any>;
}

interface CreateFormRequest {
  status: 'DRAFT' | 'PUBLISHED';
  blocks: TallyBlock[];
}

@authenticate('fsae-jwt')
export class TallyFormController {
  constructor(
    @repository(TallyFormRepository)
    public tallyFormRepository: TallyFormRepository,
    @repository(TallyWebhookRepository)
    public tallyWebhookRepository: TallyWebhookRepository,
    @repository(JobAdRepository)
    public jobAdRepository: JobAdRepository,
    @repository(TallySubmissionRepository)
    public tallySubmissionRepository: TallySubmissionRepository,
    @repository(ApplicationNonceRepository)
    public applicationNonceRepository: ApplicationNonceRepository,
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
    @inject('services.TallyService')
    public tallyService: TallyService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentUserProfile: UserProfile,
  ) {}

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @post('/api/sponsors/jobs/{jobId}/form')
  @response(200, {
    description: 'Create a Tally.so form linked to a specific job',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            form_id: {type: 'string'},
            tally_form_id: {type: 'string'},
            edit_url: {type: 'string'},
            embed_code: {type: 'string'},
            preview_url: {type: 'string'},
          },
        },
      },
    },
  })
  async createJobForm(
    @param.path.string('jobId') jobId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['status', 'blocks'],
            properties: {
              status: {
                type: 'string',
                enum: ['DRAFT', 'PUBLISHED'],
              },
              blocks: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['uuid', 'type', 'groupUuid', 'groupType', 'payload'],
                  properties: {
                    uuid: {type: 'string'},
                    type: {type: 'string'},
                    groupUuid: {type: 'string'},
                    groupType: {type: 'string'},
                    payload: {type: 'object'},
                  },
                },
              },
            },
          },
        },
      },
    })
    formData: CreateFormRequest,
  ): Promise<{form_id: string; tally_form_id: string; edit_url: string; embed_code: string; preview_url: string}> {
    try {
      // Validate the request body against Zod schema
      const validatedFormData = validateCreateFormRequest(formData);

      // Verify job exists and user owns it
      const job = await this.jobAdRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound('Job not found');
      }

      const userId = this.currentUserProfile.id.toString().trim();
      const publisherId = job.publisherID.toString().trim();
      const isOwner = publisherId === userId;

      if (!isOwner) {
        throw new HttpErrors.Forbidden('You can only create forms for your own jobs');
      }

      // Check if form already exists for this job
      const existingForm = await this.tallyFormRepository.findOne({
        where: {jobId: jobId, isActive: true},
      });

      if (existingForm) {
        throw new HttpErrors.Conflict('A form already exists for this job');
      }

      // Extract form title from FORM_TITLE block
      const formTitleBlock = validatedFormData.blocks.find(block => block.type === 'FORM_TITLE');
      const formTitle: string = formTitleBlock?.payload && 'html' in formTitleBlock.payload
        ? (formTitleBlock.payload.html as string)
        : 'Application Form';

      // Auto-inject hidden member ID field (for secure member linking)
      const MEMBER_ID_FIELD_KEY = 'platform-member-id-hidden-field';  // Key in webhook submissions
      const MEMBER_ID_FIELD_UUID = crypto.randomUUID();  // Hidden field UUID
      const MEMBER_ID_BLOCK_UUID = crypto.randomUUID();  // Block UUID
      const MEMBER_ID_GROUP_UUID = crypto.randomUUID();  // Group UUID

      const memberIdHiddenField = {
        uuid: MEMBER_ID_BLOCK_UUID,
        type: 'HIDDEN_FIELDS',  // Correct type (plural)
        groupUuid: MEMBER_ID_GROUP_UUID,
        groupType: 'HIDDEN_FIELDS',  // Correct groupType (plural)
        payload: {
          hiddenFields: [  // Correct payload structure
            {
              uuid: MEMBER_ID_FIELD_UUID,
              name: MEMBER_ID_FIELD_KEY  // Key that appears in webhook submissions
            }
          ]
        },
      };

      // Insert hidden field at position 1 (right after FORM_TITLE at position 0)
      // This ensures: blocks[0] = FORM_TITLE, blocks[1] = hidden member ID, blocks[2+] = user fields
      const blocksWithMemberId = [
        validatedFormData.blocks[0], // FORM_TITLE (must be first)
        memberIdHiddenField,          // Hidden member ID (always position 1)
        ...validatedFormData.blocks.slice(1), // User-configured fields (position 2+)
      ];

      // Create form via Tally API with auto-injected hidden field
      const tallyFormResponse = await this.tallyService.createForm({
        name: formTitle,
        status: validatedFormData.status,
        blocks: blocksWithMemberId,
      });

      // Generate URLs and embed code
      const editUrl = this.tallyService.generateEditUrl(tallyFormResponse.id);
      const previewUrl = this.tallyService.generatePreviewUrl(tallyFormResponse.id);
      const embedCode = this.tallyService.generateEmbedCode(tallyFormResponse.id);

      // Store form metadata in database
      const formRecord = await this.tallyFormRepository.create({
        jobId: jobId,
        tallyFormId: tallyFormResponse.id,
        formTitle: formTitle,
        embedCode: embedCode,
        previewUrl: previewUrl,
        editUrl: editUrl,
        submissionCount: 0,
        isActive: true,
      });

      // Update job with form ID
      await this.jobAdRepository.updateById(jobId, {
        tallyFormId: formRecord.id,
      });

      // Create webhook for form submissions
      const webhookUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/applications`;
      const webhookData = {
        formId: tallyFormResponse.id,
        url: webhookUrl,
        eventTypes: ['FORM_RESPONSE'],
      };

      try {
        const webhookResponse = await this.tallyService.createWebhook(webhookData);

        // Store webhook metadata
        await this.tallyWebhookRepository.create({
          formId: formRecord.id!,
          tallyWebhookId: webhookResponse.id,
          callbackUrl: webhookUrl,
          eventTypes: ['FORM_RESPONSE'],
          isActive: true,
        });
      } catch (webhookError) {
        console.warn('Failed to create webhook, but form creation succeeded:', webhookError);
      }

      return {
        form_id: formRecord.id!,
        tally_form_id: tallyFormResponse.id,
        edit_url: editUrl,
        embed_code: embedCode,
        preview_url: previewUrl,
      };
    } catch (error) {
      console.error('Error creating job form:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to create form');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR, FsaeRole.MEMBER],
  })
  @get('/api/sponsors/jobs/{jobId}/form')
  @response(200, {
    description: 'Get all forms associated with a job',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              form_id: {type: 'string'},
              response_count: {type: 'number'},
              preview_url: {type: 'string'},
              form_title: {type: 'string'},
              is_active: {type: 'boolean'},
              created_at: {type: 'string'},
            },
          },
        },
      },
    },
  })
  async getJobForms(
    @param.path.string('jobId') jobId: string,
  ): Promise<Array<{
    form_id: string;
    response_count: number;
    preview_url: string;
    form_title: string;
    is_active: boolean;
    created_at: string;
  }>> {
    try {
      // Verify job exists
      const job = await this.jobAdRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound('Job not found');
      }

      // For members, they can view any job's form info
      // For sponsors/alumni, they should only see their own job forms
      const currentUserRole = this.currentUserProfile.role;
      const userId = this.currentUserProfile.id.toString().trim();
      const publisherId = job.publisherID.toString().trim();
      const isOwner = publisherId === userId;
      const isMember = currentUserRole === FsaeRole.MEMBER;

      if (!isMember && !isOwner) {
        throw new HttpErrors.Forbidden('You can only view forms for your own jobs');
      }

      const forms = await this.tallyFormRepository.find({
        where: {jobId: jobId},
        order: ['createdAt DESC'],
      });

      return forms.map(form => ({
        form_id: form.id!,
        response_count: form.submissionCount,
        preview_url: form.previewUrl || '',
        form_title: form.formTitle,
        is_active: form.isActive,
        created_at: form.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error getting job forms:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to get forms');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @get('/api/jobs/{jobId}/apply')
  @response(200, {
    description: 'Get form embed info for applying',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            form_title: {type: 'string'},
            embed_code: {type: 'string'},
            preview_url: {type: 'string'},
            has_form: {type: 'boolean'},
          },
        },
      },
    },
  })
  async getJobApplicationForm(
    @param.path.string('jobId') jobId: string,
  ): Promise<{
    form_title: string;
    embed_url?: string;
    embed_code?: string;
    preview_url: string;
    has_form: boolean;
    already_applied?: boolean;
    submission_date?: Date;
  }> {
    try {
      // Get authenticated member info
      const memberId = this.currentUserProfile.id;

      // Fetch member from database to get email (not in JWT payload)
      const member = await this.memberRepository.findById(memberId);
      if (!member) {
        throw new HttpErrors.NotFound('Member not found');
      }
      const memberEmail = member.email;

      // Verify job exists
      const job = await this.jobAdRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound('Job not found');
      }

      // Find active form for this job
      const form = await this.tallyFormRepository.findOne({
        where: {jobId: jobId, isActive: true},
      });

      if (!form) {
        return {
          form_title: '',
          embed_code: '',
          preview_url: job.applicationLink || '',
          has_form: false,
        };
      }

      // Check if member already applied
      const existingSubmission = await this.tallySubmissionRepository.findOne({
        where: {memberId: memberId, formId: form.id},
      });

      if (existingSubmission) {
        return {
          form_title: form.formTitle,
          preview_url: form.previewUrl || '',
          has_form: true,
          already_applied: true,
          submission_date: existingSubmission.submittedAt,
        };
      }

      // Generate JWT token with nonce for secure member linking
      const nonce = crypto.randomBytes(16).toString('hex');
      const tokenSecret = process.env.APPLICATION_TOKEN_SECRET;

      if (!tokenSecret) {
        throw new HttpErrors.InternalServerError(
          'Application token secret not configured',
        );
      }

      const token = jwt.sign(
        {
          memberId,
          memberEmail,
          jobId,
          formId: form.id,
          nonce,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        },
        tokenSecret,
      );

      // Store nonce in database with pending status
      await this.applicationNonceRepository.create({
        nonce,
        status: 'pending',
        memberId,
        jobId,
        expiresAt: new Date(Date.now() + 86400000), // 24 hours in ms
      });

      // Return embed URL with token parameter (hidden field auto-population)
      const embedUrl = `https://tally.so/embed/${form.tallyFormId}?platform-member-id-hidden-field=${token}`;

      return {
        form_title: form.formTitle,
        embed_url: embedUrl,
        preview_url: form.previewUrl || '',
        has_form: true,
        already_applied: false,
      };
    } catch (error) {
      console.error('Error getting application form:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to get application form');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @get('/api/sponsors/forms/{formId}/submissions')
  @response(200, {
    description: 'Get all submissions for a form',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            submissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {type: 'string'},
                  applicant_email: {type: 'string'},
                  applicant_name: {type: 'string'},
                  status: {type: 'string'},
                  submitted_at: {type: 'string'},
                  reviewed_by: {type: 'string'},
                  reviewed_at: {type: 'string'},
                  notes: {type: 'string'},
                },
              },
            },
            total_count: {type: 'number'},
            unread_count: {type: 'number'},
          },
        },
      },
    },
  })
  async getFormSubmissions(
    @param.path.string('formId') formId: string,
    @param.query.string('status') status?: 'unread' | 'reviewed' | 'shortlisted' | 'rejected',
  ): Promise<{
    submissions: Array<{
      id: string;
      applicant_email?: string;
      applicant_name?: string;
      status: string;
      submitted_at: string;
      reviewed_by?: string;
      reviewed_at?: string;
      notes?: string;
      submission_data: object;
    }>;
    total_count: number;
    unread_count: number;
  }> {
    try {
      // Verify form exists and user owns it
      const form = await this.tallyFormRepository.findById(formId);
      if (!form) {
        throw new HttpErrors.NotFound('Form not found');
      }

      // Get job to verify ownership
      const job = await this.jobAdRepository.findById(form.jobId);
      if (!job) {
        throw new HttpErrors.NotFound('Job not found');
      }

      const userId = this.currentUserProfile.id.toString().trim();
      const publisherId = job.publisherID.toString().trim();
      const isOwner = publisherId === userId;

      if (!isOwner) {
        throw new HttpErrors.Forbidden('You can only view submissions for your own forms');
      }

      // Build query filter
      const where: any = {formId: formId};
      if (status) {
        where.status = status;
      }

      // Get submissions
      const submissions = await this.tallySubmissionRepository.find({
        where,
        order: ['submittedAt DESC'],
      });

      // Get unread count
      const unreadCount = await this.tallySubmissionRepository.count({
        formId: formId,
        status: 'unread',
      });

      return {
        submissions: submissions.map(sub => ({
          id: sub.id!,
          applicant_email: sub.applicantEmail,
          applicant_name: sub.applicantName,
          status: sub.status,
          submitted_at: sub.submittedAt.toISOString(),
          reviewed_by: sub.reviewedBy,
          reviewed_at: sub.reviewedAt?.toISOString(),
          notes: sub.notes,
          submission_data: sub.submissionData,
        })),
        total_count: submissions.length,
        unread_count: unreadCount.count,
      };
    } catch (error) {
      console.error('Error getting form submissions:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to get submissions');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @put('/api/sponsors/submissions/{submissionId}')
  @response(200, {
    description: 'Update submission status and notes',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            submission: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                status: {type: 'string'},
                notes: {type: 'string'},
                reviewed_by: {type: 'string'},
                reviewed_at: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async updateSubmissionStatus(
    @param.path.string('submissionId') submissionId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['unread', 'reviewed', 'shortlisted', 'rejected'],
              },
              notes: {type: 'string'},
            },
          },
        },
      },
    })
    updateData: {
      status?: 'unread' | 'reviewed' | 'shortlisted' | 'rejected';
      notes?: string;
    },
  ): Promise<{
    success: boolean;
    submission: {
      id: string;
      status: string;
      notes?: string;
      reviewed_by: string;
      reviewed_at: string;
    };
  }> {
    try {
      // Get submission
      const submission = await this.tallySubmissionRepository.findById(submissionId);
      if (!submission) {
        throw new HttpErrors.NotFound('Submission not found');
      }

      // Get form to verify ownership
      const form = await this.tallyFormRepository.findById(submission.formId);
      if (!form) {
        throw new HttpErrors.NotFound('Form not found');
      }

      // Get job to verify ownership
      const job = await this.jobAdRepository.findById(form.jobId);
      if (!job) {
        throw new HttpErrors.NotFound('Job not found');
      }

      const userId = this.currentUserProfile.id.toString().trim();
      const publisherId = job.publisherID.toString().trim();
      const isOwner = publisherId === userId;

      if (!isOwner) {
        throw new HttpErrors.Forbidden('You can only update submissions for your own forms');
      }

      // Update submission
      const updateFields: any = {
        updatedAt: new Date(),
      };

      if (updateData.status) {
        updateFields.status = updateData.status;
      }

      if (updateData.notes !== undefined) {
        updateFields.notes = updateData.notes;
      }

      // Mark as reviewed if status is changing from unread
      if (updateData.status && submission.status === 'unread' && updateData.status !== 'unread') {
        updateFields.reviewedBy = userId;
        updateFields.reviewedAt = new Date();
      }

      await this.tallySubmissionRepository.updateById(submissionId, updateFields);

      // Fetch updated submission
      const updatedSubmission = await this.tallySubmissionRepository.findById(submissionId);

      return {
        success: true,
        submission: {
          id: updatedSubmission.id!,
          status: updatedSubmission.status,
          notes: updatedSubmission.notes,
          reviewed_by: updatedSubmission.reviewedBy || userId,
          reviewed_at: updatedSubmission.reviewedAt?.toISOString() || new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error updating submission:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to update submission');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.MEMBER],
  })
  @get('/api/applicants/{applicantId}/submissions')
  @response(200, {
    description: 'Get all submissions for an applicant',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            submissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {type: 'string'},
                  job_title: {type: 'string'},
                  company_name: {type: 'string'},
                  status: {type: 'string'},
                  submitted_at: {type: 'string'},
                },
              },
            },
          },
        },
      },
    },
  })
  async getApplicantSubmissions(
    @param.path.string('applicantId') applicantId: string,
  ): Promise<{
    submissions: Array<{
      id: string;
      job_title: string;
      company_name: string;
      status: string;
      submitted_at: string;
      form_title: string;
    }>;
  }> {
    try {
      // Verify user is requesting their own submissions
      const userId = this.currentUserProfile.id.toString().trim();
      if (applicantId !== userId) {
        throw new HttpErrors.Forbidden('You can only view your own submissions');
      }

      // Get all submissions for this applicant (matching by email)
      const userEmail = this.currentUserProfile.email;
      const submissions = await this.tallySubmissionRepository.find({
        where: {
          applicantEmail: userEmail,
        },
        order: ['submittedAt DESC'],
      });

      // Fetch form and job details for each submission
      const enrichedSubmissions = await Promise.all(
        submissions.map(async sub => {
          const form = await this.tallyFormRepository.findById(sub.formId);
          const job = await this.jobAdRepository.findById(form.jobId);

          return {
            id: sub.id!,
            job_title: job.title,
            company_name: job.publisherID, // TODO: Fetch actual company name from publisher profile
            status: sub.status,
            submitted_at: sub.submittedAt.toISOString(),
            form_title: form.formTitle,
          };
        }),
      );

      return {
        submissions: enrichedSubmissions,
      };
    } catch (error) {
      console.error('Error getting applicant submissions:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to get submissions');
    }
  }

  @authorize({
    allowedRoles: [FsaeRole.ALUMNI, FsaeRole.SPONSOR],
  })
  @post('/api/sponsors/forms/{formId}/webhook')
  @response(200, {
    description: 'Manually configure or update webhook for a form',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            webhook_id: {type: 'string'},
            callback_url: {type: 'string'},
          },
        },
      },
    },
  })
  async configureWebhook(
    @param.path.string('formId') formId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              callback_url: {type: 'string'},
              secret: {type: 'string'},
            },
          },
        },
      },
    })
    webhookConfig: {
      callback_url?: string;
      secret?: string;
    },
  ): Promise<{
    success: boolean;
    webhook_id: string;
    callback_url: string;
  }> {
    try {
      // Verify form exists and user owns it
      const form = await this.tallyFormRepository.findById(formId);
      if (!form) {
        throw new HttpErrors.NotFound('Form not found');
      }

      // Get job to verify ownership
      const job = await this.jobAdRepository.findById(form.jobId);
      if (!job) {
        throw new HttpErrors.NotFound('Job not found');
      }

      const userId = this.currentUserProfile.id.toString().trim();
      const publisherId = job.publisherID.toString().trim();
      const isOwner = publisherId === userId;

      if (!isOwner) {
        throw new HttpErrors.Forbidden('You can only configure webhooks for your own forms');
      }

      // Check if webhook already exists
      const existingWebhook = await this.tallyWebhookRepository.findOne({
        where: {formId: formId},
      });

      const callbackUrl = webhookConfig.callback_url ||
        `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/applications`;

      if (existingWebhook) {
        // Update existing webhook via Tally API
        const webhookData: any = {
          formId: form.tallyFormId,
          url: callbackUrl,
          eventTypes: ['FORM_RESPONSE'],
        };

        if (webhookConfig.secret) {
          webhookData.signingSecret = webhookConfig.secret;
        }

        await this.tallyService.createWebhook(webhookData);

        // Update local record
        await this.tallyWebhookRepository.updateById(existingWebhook.id, {
          callbackUrl: callbackUrl,
          secret: webhookConfig.secret,
          updatedAt: new Date(),
        });

        return {
          success: true,
          webhook_id: existingWebhook.id!,
          callback_url: callbackUrl,
        };
      } else {
        // Create new webhook
        const webhookData: any = {
          formId: form.tallyFormId,
          url: callbackUrl,
          eventTypes: ['FORM_RESPONSE'],
        };

        if (webhookConfig.secret) {
          webhookData.signingSecret = webhookConfig.secret;
        }

        const webhookResponse = await this.tallyService.createWebhook(webhookData);

        // Store webhook metadata
        const webhook = await this.tallyWebhookRepository.create({
          formId: formId,
          tallyWebhookId: webhookResponse.id,
          callbackUrl: callbackUrl,
          secret: webhookConfig.secret,
          eventTypes: ['FORM_RESPONSE'],
          isActive: true,
        });

        return {
          success: true,
          webhook_id: webhook.id!,
          callback_url: callbackUrl,
        };
      }
    } catch (error) {
      console.error('Error configuring webhook:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Failed to configure webhook');
    }
  }

}