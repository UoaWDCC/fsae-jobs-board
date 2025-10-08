import { z } from "zod";

/** Reusable primitive */
const Uuid = z.string().uuid();

/** ---------- Payload schema ---------- */

export const LabelPayload = z.object({
  html: z.string().optional(),
  isHidden: z.boolean().optional(),
  isFolded: z.boolean().optional(),
  columnListUuid: Uuid.optional(),
  columnUuid: Uuid.optional(),
  columnRatio: z.number().optional(),
}).passthrough();  // Allow undocumented fields for future-proofing

export type LabelPayload = z.infer<typeof LabelPayload>;
