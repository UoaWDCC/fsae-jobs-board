import { z } from "zod";

/** Reusable primitives + enums */
const Uuid = z.string().uuid();

const FieldType = z.enum(["InputField", "CalculatedField", "HiddenField"]);
const QuestionType = z.enum([
  "FORM_TITLE","TEXT","LABEL","TITLE","HEADING_1","HEADING_2","HEADING_3",
  "DIVIDER","PAGE_BREAK","THANK_YOU_PAGE","IMAGE","EMBED","EMBED_VIDEO","EMBED_AUDIO",
  "QUESTION","MATRIX","INPUT_TEXT","INPUT_NUMBER","INPUT_EMAIL","INPUT_LINK","INPUT_PHONE_NUMBER",
  "INPUT_DATE","INPUT_TIME","TEXTAREA","FILE_UPLOAD","LINEAR_SCALE","RATING","HIDDEN_FIELDS",
  "MULTIPLE_CHOICE_OPTION","CHECKBOX","DROPDOWN_OPTION","RANKING_OPTION","MULTI_SELECT_OPTION",
  "PAYMENT","SIGNATURE","MATRIX_ROW","MATRIX_COLUMN","WALLET_CONNECT","CONDITIONAL_LOGIC",
  "CALCULATED_FIELDS","CAPTCHA","RESPONDENT_COUNTRY",
] as const);
const CalculatedFieldType = z.enum(["NUMBER", "TEXT"]);

/** defaultAnswer (required only when hasDefaultAnswer=true) */
const DefaultAnswer = z.object({
  uuid: Uuid,
  type: FieldType,
  questionType: QuestionType,
  blockGroupUuid: Uuid,
  title: z.string().optional(),
  calculatedFieldType: CalculatedFieldType.optional(),
}).strict();

/** ---------- Payload schema ---------- */
export const InputPhoneNumberPayload = z
  .object({
    isHidden: z.boolean().optional(),
    isRequired: z.boolean().optional(),

    // Phone-specific fields
    internationalFormat: z.boolean().optional(),
    defaultCountryCode: z.string().optional(),  // ISO country codes (e.g., "NZ", "US", "AU")

    hasDefaultAnswer: z.boolean().optional(),
    defaultAnswer: DefaultAnswer.optional(),

    placeholder: z.string().optional(),

    // Keep as string to stay 1:1 with docs
    columnListUuid: z.string().optional(),
    columnUuid: z.string().optional(),
    columnRatio: z.number().optional(),

    name: z.string().optional(),
  })
  .passthrough()
  .superRefine((v, ctx) => {
    // If hasDefaultAnswer === true, defaultAnswer must be provided
    if (v.hasDefaultAnswer && !v.defaultAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultAnswer"],
        message: "defaultAnswer is required when hasDefaultAnswer is true",
      });
    }
  });

export type InputPhoneNumberPayload = z.infer<typeof InputPhoneNumberPayload>;
