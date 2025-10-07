import {HttpErrors} from '@loopback/rest';
import {CreateFormRequest} from '../schemas/tally/requests/create-form-request';
import {ZodError} from 'zod';

/**
 * Validates the create form request body against the Zod schema
 * @param data - The request body data to validate
 * @returns The validated data
 * @throws HttpErrors.UnprocessableEntity if validation fails
 */
export function validateCreateFormRequest(data: unknown): CreateFormRequest {
  try {
    // Parse and validate the data using the Zod schema
    const validatedData = CreateFormRequest.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      // Format validation errors for better readability
      const formattedErrors = error.issues.map(err => ({
        path: err.path.join('.') || '(root)',
        message: err.message,
      }));

      throw new HttpErrors.UnprocessableEntity(
        `Validation failed: ${JSON.stringify(formattedErrors)}`,
      );
    }
    // Re-throw if it's not a validation error
    throw error;
  }
}

/**
 * Type guard to check if data matches CreateFormRequest type
 * @param data - The data to check
 * @returns true if data is valid, false otherwise
 */
export function isValidCreateFormRequest(data: unknown): data is CreateFormRequest {
  const result = CreateFormRequest.safeParse(data);
  return result.success;
}