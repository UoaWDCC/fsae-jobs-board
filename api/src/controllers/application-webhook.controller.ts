import {repository} from '@loopback/repository';
import {
  post,
  requestBody,
  response,
  Request,
  RestBindings,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {
  TallyFormRepository,
  TallySubmissionRepository,
  TallyWebhookRepository,
  ApplicationNonceRepository,
  MemberRepository,
  AlumniRepository,
} from '../repositories';
import * as jwt from 'jsonwebtoken';
import {verifyTallySignature} from '../utils/webhook-signature.util';

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
    @repository(TallyWebhookRepository)
    public tallyWebhookRepository: TallyWebhookRepository,
    @repository(ApplicationNonceRepository)
    public applicationNonceRepository: ApplicationNonceRepository,
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
    @repository(AlumniRepository)
    public alumniRepository: AlumniRepository,
  ) {}

  /**
   * Webhook endpoint called by Tally when a form submission is received
   * This endpoint is publicly accessible (no authentication required)
   * as it's called by Tally's servers
   *
   * Security:
   * - Layer 1: Tally signature validation (validates webhook source)
   * - Layer 2: JWT token validation (validates applicant identity)
   * - Layer 3: Nonce validation (prevents replay attacks)
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
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<{success: boolean; submissionId: string}> {
    let webhook: any = null;

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
        // Return 200 OK to prevent retries for unknown forms
        return {
          success: false,
          submissionId: '',
        };
      }

      // Find webhook tracking record
      webhook = await this.tallyWebhookRepository.findOne({
        where: {
          formId: form.id,
          isActive: true,
        },
      });

      // SECURITY LAYER 1: Verify Tally webhook signature (MANDATORY)
      // This validates that the request genuinely came from Tally's servers
      // All webhooks MUST have signing secrets - no exceptions

      // Check webhook secret exists (required for security)
      if (!webhook || !webhook.secret) {
        console.error('Webhook missing required signing secret:', {
          formId: payload.data.formId,
          submissionId: payload.data.submissionId,
          webhookExists: !!webhook,
          hasSecret: webhook?.secret ? true : false,
        });

        // Track security configuration error
        if (webhook) {
          try {
            await this.tallyWebhookRepository.updateById(webhook.id, {
              errorCount: webhook.errorCount + 1,
              lastErrorMessage: 'Webhook missing required signing secret - security misconfiguration',
              lastSyncedAt: new Date(),
            });
          } catch (updateError) {
            console.error('Failed to update webhook error count:', updateError);
          }
        }

        // Always return 200 OK to prevent retries, but don't process the request
        return {
          success: false,
          submissionId: '',
        };
      }

      // Extract and verify signature
      const tallySignature = request.headers['tally-signature'] as string | undefined;

      const isValidSignature = verifyTallySignature(
        payload,
        tallySignature,
        webhook.secret,
      );

      if (!isValidSignature) {
        console.warn('Invalid Tally webhook signature:', {
          formId: payload.data.formId,
          submissionId: payload.data.submissionId,
          hasSignature: !!tallySignature,
        });

        // Track signature validation failure
        try {
          await this.tallyWebhookRepository.updateById(webhook.id, {
            errorCount: webhook.errorCount + 1,
            lastErrorMessage: 'Invalid webhook signature - possible forgery attempt',
            lastSyncedAt: new Date(),
          });
        } catch (updateError) {
          console.error('Failed to update webhook error count:', updateError);
        }

        // Always return 200 OK to prevent retries, but don't process the request
        return {
          success: false,
          submissionId: '',
        };
      }

      console.log('Tally webhook signature verified successfully');

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

      // SECURITY LAYER 2: Extract and validate JWT token from hidden applicant auth field
      // This validates the applicant's identity and authorization
      // Note: Tally sends the hidden field's name in the 'label' property, not 'key'
      const applicantAuthField = payload.data.fields.find(
        f => f.label === 'platform-applicant-auth-token' && f.type === 'HIDDEN_FIELDS'
      );

      if (!applicantAuthField || !applicantAuthField.value) {
        console.warn('Missing applicant auth token in submission - form submitted outside platform');
        throw new Error('Invalid submission: missing applicant authentication');
      }

      const token = applicantAuthField.value;
      const tokenSecret = process.env.APPLICATION_TOKEN_SECRET;

      if (!tokenSecret) {
        console.error('Application token secret not configured');
        throw new Error('Application token secret not configured');
      }

      // Verify and decode JWT token
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, tokenSecret);
      } catch (error) {
        console.warn('Invalid JWT token in submission:', error);
        throw new Error('Invalid or expired application token');
      }

      // Validate token fields (updated for new JWT structure)
      if (!decodedToken.applicantId || !decodedToken.nonce || !decodedToken.applicantRole) {
        console.warn('Invalid token structure:', decodedToken);
        throw new Error('Invalid token structure');
      }

      // SECURITY LAYER 3: Check nonce is pending (not already used)
      // This prevents replay attacks
      const nonceRecord = await this.applicationNonceRepository.findById(decodedToken.nonce);

      if (!nonceRecord) {
        console.warn(`Nonce not found: ${decodedToken.nonce}`);
        throw new Error('Invalid application token (nonce not found)');
      }

      if (nonceRecord.status !== 'pending') {
        console.warn(`Nonce already used: ${decodedToken.nonce}`);
        throw new Error('Application token already used');
      }

      // Check nonce not expired
      if (nonceRecord.expiresAt < new Date()) {
        console.warn(`Nonce expired: ${decodedToken.nonce}`);
        throw new Error('Application token expired');
      }

      // Verify applicant exists and fetch current profile data (role-based lookup)
      let applicantEmail: string;
      let applicantName: string;

      if (decodedToken.applicantRole === 'member') {
        const member = await this.memberRepository.findById(decodedToken.applicantId);

        if (!member) {
          console.warn(`Member not found: ${decodedToken.applicantId}`);
          throw new Error('Invalid member in token - account may have been deleted');
        }

        applicantEmail = member.email;
        applicantName = `${member.firstName} ${member.lastName}`;
      } else if (decodedToken.applicantRole === 'alumni') {
        const alumni = await this.alumniRepository.findById(decodedToken.applicantId);

        if (!alumni) {
          console.warn(`Alumni not found: ${decodedToken.applicantId}`);
          throw new Error('Invalid alumni in token - account may have been deleted');
        }

        applicantEmail = alumni.email;
        applicantName = `${alumni.firstName} ${alumni.lastName}`;
      } else {
        console.warn(`Invalid applicant role: ${decodedToken.applicantRole}`);
        throw new Error('Invalid applicant role in token');
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

      // Track successful webhook processing
      if (webhook) {
        await this.tallyWebhookRepository.updateById(webhook.id, {
          deliveryCount: webhook.deliveryCount + 1,
          lastSyncedAt: new Date(),
        });
      }

      return {
        success: true,
        submissionId: submission.id!,
      };
    } catch (error) {
      console.error('Error processing Tally webhook:', error);

      // Update webhook error tracking if webhook was found
      if (webhook) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        try {
          await this.tallyWebhookRepository.updateById(webhook.id, {
            errorCount: webhook.errorCount + 1,
            lastErrorMessage: errorMessage.substring(0, 500), // Limit to 500 chars
            lastSyncedAt: new Date(), // Track when last webhook was received (even if failed)
          });
        } catch (updateError) {
          console.error('Failed to update webhook error count:', updateError);
        }
      }

      // Always return 200 OK to prevent Tally from retrying
      // We handle all errors gracefully and track them in the database
      return {
        success: false,
        submissionId: '',
      };
    }
  }
}
