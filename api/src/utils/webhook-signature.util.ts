import {createHmac, timingSafeEqual} from 'crypto';

/**
 * Webhook signature verification utility for Tally.so webhooks
 *
 * Tally uses HMAC-SHA256 signatures to authenticate webhook requests.
 * The signature is sent in the `Tally-Signature` header.
 *
 * @see https://tally.so/help/webhooks
 */

/**
 * Verifies a Tally webhook signature using HMAC-SHA256
 *
 * @param payload - The webhook payload object (will be JSON stringified)
 * @param receivedSignature - The signature from the `Tally-Signature` header
 * @param secret - The webhook signing secret configured in Tally
 * @returns true if signature is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = verifyTallySignature(
 *   webhookPayload,
 *   request.headers['tally-signature'],
 *   webhookSecret
 * );
 *
 * if (!isValid) {
 *   throw new HttpErrors.Unauthorized('Invalid webhook signature');
 * }
 * ```
 */
export function verifyTallySignature(
  payload: any,
  receivedSignature: string | undefined,
  secret: string,
): boolean {
  // If no signature provided, validation fails
  if (!receivedSignature) {
    return false;
  }

  // If no secret configured, cannot validate
  if (!secret) {
    return false;
  }

  try {
    // Calculate expected signature
    // Tally uses: createHmac('sha256', secret).update(JSON.stringify(payload)).digest('base64')
    const expectedSignature = createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('base64');

    // Use constant-time comparison to prevent timing attacks
    // Both signatures must be same length for timingSafeEqual
    const receivedBuffer = Buffer.from(receivedSignature, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');

    // Length check (timingSafeEqual requires equal length buffers)
    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    // Constant-time comparison
    return timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch (error) {
    // If any error occurs during signature calculation/comparison, fail closed
    console.error('Error verifying Tally signature:', error);
    return false;
  }
}

/**
 * Generates a secure random webhook secret
 *
 * @param bytes - Number of random bytes to generate (default: 32)
 * @returns Hex-encoded random string suitable for webhook signing
 *
 * @example
 * ```typescript
 * const secret = generateWebhookSecret();
 * // Returns: "a1b2c3d4e5f6..."  (64 character hex string)
 * ```
 */
export function generateWebhookSecret(bytes: number = 32): string {
  const crypto = require('crypto');
  return crypto.randomBytes(bytes).toString('hex');
}
