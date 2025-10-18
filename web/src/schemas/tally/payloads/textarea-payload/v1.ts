import { z } from "zod";

/**
 * TextareaPayload v1 Schema
 *
 * Based on empirical testing
 * TEXTAREA is essentially INPUT_TEXT but allows multi-line input.
 *
 * Minimal implementation includes:
 * - isRequired: Required field validation
 * - placeholder: Hint text
 *
 * Future features (backend supports, UI doesn't expose):
 * - defaultAnswer (simple string)
 * - minCharacters/maxCharacters (character limits)
 *
 * Empirical API response structure:
 * {
 *   "type": "TEXTAREA",
 *   "groupUuid": "b982023b-f4bb-457c-9c9d-88425672bdfc",
 *   "groupType": "TEXTAREA",
 *   "payload": {
 *     "isRequired": true,
 *     "hasDefaultAnswer": false,
 *     "placeholder": "placeholder text for text area"
 *   }
 * }
 */
export const TextareaPayload = z
  .object({
    isHidden: z.boolean().optional(),
    isRequired: z.boolean().optional(),

    placeholder: z.string().optional(),

    // Future features (not exposed in UI yet, but supported by Tally API)
    hasDefaultAnswer: z.boolean().optional(),
    defaultAnswer: z.string().optional(),

    hasMinCharacters: z.boolean().optional(),
    minCharacters: z.number().optional(),

    hasMaxCharacters: z.boolean().optional(),
    maxCharacters: z.number().optional(),

    columnListUuid: z.string().optional(),
    columnUuid: z.string().optional(),
    columnRatio: z.number().optional(),

    name: z.string().optional(),
  })
  .passthrough();  // Allow undocumented Tally fields

export type TextareaPayload = z.infer<typeof TextareaPayload>;
