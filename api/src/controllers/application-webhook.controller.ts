import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  post,
  requestBody,
  response,
  HttpErrors,
  Request,
  RestBindings,
} from '@loopback/rest';
import {
  TallyFormRepository,
  TallySubmissionRepository,
  ApplicationNonceRepository,
  MemberRepository,
  AlumniRepository,
} from '../repositories';
import * as jwt from 'jsonwebtoken';

/**
 * Tally webhook payload structure for FORM_RESPONSE events
 */
interface TallyWebhookPayload {
  eventId: string;
  eventType: 'FORM_RESPONSE';
  createdAt: string;
  data: {
    responseId: string;
    submissionId: string;
    respondentId: string;
    formId: string;
    formName: string;
    createdAt: string;
    fields: Array<{
      key: string;
      label: string;
      type: string;
      value: any;
      options?: Array<{
        id: string;
        text: string;
      }>;
    }>;
  };
}

/**
 * Controller to handle webhook callbacks from Tally.so
 * Receives form submissions and stores them in the database
 */
export class ApplicationWebhookController {
  constructor(
    @repository(TallyFormRepository)
    public tallyFormRepository: TallyFormRepository,
    @repository(TallySubmissionRepository)
    public tallySubmissionRepository: TallySubmissionRepository,
    @repository(ApplicationNonceRepository)
    public applicationNonceRepository: ApplicationNonceRepository,
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
    @repository(AlumniRepository)
    public alumniRepository: AlumniRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) {}

  /**
   * Webhook endpoint called by Tally when a form submission is received
   * This endpoint is publicly accessible (no authentication required)
   * as it's called by Tally's servers
   */
  @post('/api/applications')
  @response(200, {
    description: 'Webhook received successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            submissionId: {type: 'string'},
          },
        },
      },
    },
  })
  async handleFormSubmission(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              eventId: {type: 'string'},
              eventType: {type: 'string'},
              createdAt: {type: 'string'},
              data: {
                type: 'object',
                properties: {
                  responseId: {type: 'string'},
                  submissionId: {type: 'string'},
                  respondentId: {type: 'string'},
                  formId: {type: 'string'},
                  formName: {type: 'string'},
                  createdAt: {type: 'string'},
                  fields: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    payload: TallyWebhookPayload,
  ): Promise<{success: boolean; submissionId: string}> {
    try {
      console.log('Received Tally webhook:', {
        eventType: payload.eventType,
        formId: payload.data.formId,
        submissionId: payload.data.submissionId,
      });

      // Find the form record in our database
      const form = await this.tallyFormRepository.findOne({
        where: {
          tallyFormId: payload.data.formId,
          isActive: true,
        },
      });

      if (!form) {
        console.warn(`Form not found for Tally form ID: ${payload.data.formId}`);
        throw new HttpErrors.NotFound('Form not found');
      }

      // Check if submission already exists (idempotency check)
      const existingSubmission = await this.tallySubmissionRepository.findOne({
        where: {
          tallySubmissionId: payload.data.submissionId,
        },
      });

      if (existingSubmission) {
        console.log(`Submission ${payload.data.submissionId} already exists (duplicate webhook)`);
        return {
          success: true,
          submissionId: existingSubmission.id!,
        };
      }

      // Extract and validate JWT token from hidden applicant auth field
      // Note: Tally sends the hidden field's name in the 'label' property, not 'key'
      const applicantAuthField = payload.data.fields.find(
        f => f.label === 'platform-applicant-auth-token' && f.type === 'HIDDEN_FIELDS'
      );

      if (!applicantAuthField || !applicantAuthField.value) {
        console.error('Missing applicant auth token in submission');
        throw new HttpErrors.BadRequest('Invalid submission: missing applicant authentication');
      }

      const token = applicantAuthField.value;
      const tokenSecret = process.env.APPLICATION_TOKEN_SECRET;

      if (!tokenSecret) {
        throw new HttpErrors.InternalServerError('Application token secret not configured');
      }

      // Verify and decode JWT token
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, tokenSecret);
      } catch (error) {
        console.error('Invalid JWT token in submission:', error);
        throw new HttpErrors.Unauthorized('Invalid or expired application token');
      }

      // Validate token fields (updated for new JWT structure)
      if (!decodedToken.applicantId || !decodedToken.nonce || !decodedToken.applicantRole) {
        throw new HttpErrors.BadRequest('Invalid token structure');
      }

      // Check nonce is pending (not already used)
      const nonceRecord = await this.applicationNonceRepository.findById(decodedToken.nonce);

      if (!nonceRecord) {
        console.error(`Nonce not found: ${decodedToken.nonce}`);
        throw new HttpErrors.Unauthorized('Invalid application token (nonce not found)');
      }

      if (nonceRecord.status !== 'pending') {
        console.error(`Nonce already used: ${decodedToken.nonce}`);
        throw new HttpErrors.Unauthorized('Application token already used');
      }

      // Check nonce not expired
      if (nonceRecord.expiresAt < new Date()) {
        console.error(`Nonce expired: ${decodedToken.nonce}`);
        throw new HttpErrors.Unauthorized('Application token expired');
      }

      // Verify applicant exists and fetch current profile data (role-based lookup)
      let applicantEmail: string;
      let applicantName: string;

      if (decodedToken.applicantRole === 'member') {
        const member = await this.memberRepository.findById(decodedToken.applicantId);

        if (!member) {
          console.error(`Member not found: ${decodedToken.applicantId}`);
          throw new HttpErrors.Unauthorized('Invalid member in token');
        }

        applicantEmail = member.email;
        applicantName = `${member.firstName} ${member.lastName}`;
      } else if (decodedToken.applicantRole === 'alumni') {
        const alumni = await this.alumniRepository.findById(decodedToken.applicantId);

        if (!alumni) {
          console.error(`Alumni not found: ${decodedToken.applicantId}`);
          throw new HttpErrors.Unauthorized('Invalid alumni in token');
        }

        applicantEmail = alumni.email;
        applicantName = `${alumni.firstName} ${alumni.lastName}`;
      } else {
        console.error(`Invalid applicant role: ${decodedToken.applicantRole}`);
        throw new HttpErrors.Unauthorized('Invalid applicant role in token');
      }

      // Mark nonce as used
      await this.applicationNonceRepository.updateById(decodedToken.nonce, {
        status: 'used',
      });

      // Create submission record with validated applicant ID and role
      const submission = await this.tallySubmissionRepository.create({
        formId: form.id!,
        tallySubmissionId: payload.data.submissionId,
        applicantId: decodedToken.applicantId,
        applicantRole: decodedToken.applicantRole,
        applicantEmail: applicantEmail,
        applicantName: applicantName,
        submissionData: payload.data,
        status: 'unread',
        submittedAt: new Date(payload.data.createdAt),
      });

      // Update form submission count
      await this.tallyFormRepository.updateById(form.id, {
        submissionCount: form.submissionCount + 1,
        updatedAt: new Date(),
      });

      console.log(`Successfully stored submission ${submission.id} for form ${form.id}`);

      return {
        success: true,
        submissionId: submission.id!,
      };
    } catch (error) {
      console.error('Error processing Tally webhook:', error);

      // Return 200 even on error to prevent Tally from retrying
      // (except for validation errors which should be retried)
      if (error instanceof HttpErrors.NotFound) {
        throw error;
      }

      // Log error but return success to avoid webhook retries for our internal errors
      return {
        success: false,
        submissionId: '',
      };
    }
  }

  /**
   * Validates webhook signature to ensure request is from Tally
   * TODO: Implement when signing secret is available
   */
  private validateWebhookSignature(
    payload: TallyWebhookPayload,
    signature?: string | string[],
  ): void {
    // Implementation would use HMAC-SHA256 with signing secret
    // const expectedSignature = crypto
    //   .createHmac('sha256', signingSecret)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    //
    // if (signature !== expectedSignature) {
    //   throw new HttpErrors.Unauthorized('Invalid webhook signature');
    // }
  }
}
