import { z } from "zod";

// Reusable primitives
export const Uuid = z.string().uuid();

// Keep creation statuses narrow for now
export const FormStatus = z.enum(["DRAFT", "PUBLISHED"]);

// Current block types supported for this task
export const SupportedGroupTypes = z.enum([
  "FORM_TITLE",
  "TEXT",
  "LABEL",
  "INPUT_TEXT",
  "MULTIPLE_CHOICE_OPTION",
  "CHECKBOX",
]);

// Todo: Add request-level common fields here if needed
// e.g. createdBy, requestId, etc:
export const BaseRequest = z.object({
  status: FormStatus,
});
