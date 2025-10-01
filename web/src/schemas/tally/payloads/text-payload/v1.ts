import { z } from "zod";

/** Reusable primitives */
const Uuid = z.uuid();

export const TextPayload = z.object({
  html: z.string().optional(),
  isHidden: z.boolean().optional(),
  columnListUuid: Uuid.optional(),
  columnUuid: Uuid.optional(),
  columnRatio: z.number().optional(),
}).strict();

export type TextPayload = z.infer<typeof TextPayload>;