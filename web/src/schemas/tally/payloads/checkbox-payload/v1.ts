import { z } from "zod";

const Uuid = z.string().uuid();

/**
 * CheckboxPayload Schema
 *
 * NOTE: This schema uses .passthrough() to allow undocumented fields from Tally API.
 * Through testing, discrepancies in fields not in the official documentation
 * but required for full functionality were found.
 *
 * Documented fields (from Tally API docs):
 * - label, isRequired, defaultChecked, isHidden, columnListUuid, columnUuid, columnRatio, name
 *
 * Discovered fields (found via UI-created forms):
 * - text: Appears to control the checkbox label text (UNDOCUMENTED but functional)
 */
export const CheckboxPayload = z.object({
  label: z.string().optional(),           // Display text next to checkbox (documented)
  text: z.string().optional(),            // Checkbox label text (UNDOCUMENTED - discovered via UI testing)
  isRequired: z.boolean().optional(),     // Must check to continue (documented)
  defaultChecked: z.boolean().optional(), // Pre-checked by default (documented)
  isHidden: z.boolean().optional(),       // Hide conditionally in form (documented)

  columnListUuid: Uuid.optional(),        // Column layout UUID (documented)
  columnUuid: Uuid.optional(),            // Column UUID (documented)
  columnRatio: z.number().optional(),     // Column ratio (documented)

  name: z.string().optional(),            // Internal name (documented)
}).passthrough(); // Allow undocumented fields to prevent data loss

export type CheckboxPayload = z.infer<typeof CheckboxPayload>;
