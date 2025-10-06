import { z } from "zod";

/**
 * TitlePayload v1 Schema
 *
 * TITLE blocks are used for question titles and section headings throughout the form.
 * They can be added multiple times via the form builder.
 *
 * NOTE: This is DIFFERENT from FORM_TITLE:
 * - FORM_TITLE: Only appears once at the top of the form (form name, logo, cover)
 * - TITLE: Can appear multiple times as question labels/headings
 *
 * Based on observation from test forms:
 * - TITLE blocks use `safeHTMLSchema` in GET responses
 * - Likely accepts `html` in POST requests (similar to FORM_TITLE pattern)
 *
 * Structure observed in GET response:
 * {
 *   "type": "TITLE",
 *   "groupUuid": "...",
 *   "groupType": "QUESTION",
 *   "payload": {
 *     "safeHTMLSchema": [["Question title text here"]]
 *   }
 * }
 */
export const TitlePayload = z
  .object({
    /**
     * HTML content for the title
     * Used in POST requests - likely converted to safeHTMLSchema in GET response
     */
    html: z.string().optional(),

    /**
     * Safe HTML schema (nested array format)
     * Present in GET responses
     * Format: [["Title text here"]]
     */
    safeHTMLSchema: z.array(z.array(z.string())).optional(),
  })
  .passthrough(); // Allow undocumented fields

export type TitlePayload = z.infer<typeof TitlePayload>;

/**
 * USAGE NOTES:
 *
 * For POST requests (creating forms):
 * ```typescript
 * {
 *   type: "TITLE",
 *   groupUuid: uuid(),
 *   groupType: "QUESTION",
 *   payload: {
 *     html: "What is your experience level?"
 *   }
 * }
 * ```
 *
 * GET response will include:
 * ```typescript
 * {
 *   payload: {
 *     safeHTMLSchema: [["What is your experience level?"]]
 *   }
 * }
 * ```
 */
