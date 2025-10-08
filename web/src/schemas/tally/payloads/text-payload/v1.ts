import { z } from "zod";

/** Reusable primitives */
const Uuid = z.uuid();

/**
 * TextPayload Schema
 *
 * Uses .passthrough() to allow undocumented fields from Tally API.
 * This prevents data loss when Tally returns additional fields not in their documentation.
 */
export const TextPayload = z.object({
  html: z.string().optional(),
  isHidden: z.boolean().optional(),
  columnListUuid: Uuid.optional(),
  columnUuid: Uuid.optional(),
  columnRatio: z.number().optional(),
}).passthrough(); // Allow undocumented fields to prevent data loss

export type TextPayload = z.infer<typeof TextPayload>;