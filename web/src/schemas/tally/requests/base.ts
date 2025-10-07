import { z } from "zod";

// Reusable primitives
export const Uuid = z.string().uuid();

// Keep creation statuses narrow for now
export const FormStatus = z.enum(["DRAFT", "PUBLISHED"]);

// Complete enum of all Tally block types (from API documentation)
// Both 'type' and 'groupType' fields use values from this enum
export const TallyBlockType = z.enum([
  "FORM_TITLE",
  "TEXT",
  "LABEL",
  "TITLE",
  "HEADING_1",
  "HEADING_2",
  "HEADING_3",
  "DIVIDER",
  "PAGE_BREAK",
  "THANK_YOU_PAGE",
  "IMAGE",
  "EMBED",
  "EMBED_VIDEO",
  "EMBED_AUDIO",
  "QUESTION",
  "MATRIX",
  "INPUT_TEXT",
  "INPUT_NUMBER",
  "INPUT_EMAIL",
  "INPUT_LINK",
  "INPUT_PHONE_NUMBER",
  "INPUT_DATE",
  "INPUT_TIME",
  "TEXTAREA",
  "FILE_UPLOAD",
  "LINEAR_SCALE",
  "RATING",
  "HIDDEN_FIELDS",
  "MULTIPLE_CHOICE_OPTION",
  "CHECKBOX",
  "DROPDOWN_OPTION",
  "RANKING_OPTION",
  "MULTI_SELECT_OPTION",
  "PAYMENT",
  "SIGNATURE",
  "MATRIX_ROW",
  "MATRIX_COLUMN",
  "WALLET_CONNECT",
  "CONDITIONAL_LOGIC",
  "CALCULATED_FIELDS",
  "CAPTCHA",
  "RESPONDENT_COUNTRY",
]);

// Subset of block types we currently support with payload validation
// These are the only types allowed in the 'type' field currently
export const SupportedBlockTypes = z.enum([
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
