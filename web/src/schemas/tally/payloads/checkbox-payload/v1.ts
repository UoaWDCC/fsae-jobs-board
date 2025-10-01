import { z } from "zod";

const Uuid = z.string().uuid();

export const CheckboxPayload = z.object({
  label: z.string().optional(),           // Display text next to checkbox
  isRequired: z.boolean().optional(),     // Must check to continue
  defaultChecked: z.boolean().optional(), // Pre-checked by default
  isHidden: z.boolean().optional(),       // Hide conditionally in form

  columnListUuid: Uuid.optional(),
  columnUuid: Uuid.optional(),
  columnRatio: z.number().optional(),

  name: z.string().optional(),            // Internal name (if supplied)
}).strict();

export type CheckboxPayload = z.infer<typeof CheckboxPayload>;
