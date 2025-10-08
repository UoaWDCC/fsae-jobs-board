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
export const InputTextPayload = z
  .object({
    isHidden: z.boolean().optional(),
    isRequired: z.boolean().optional(),

    hasDefaultAnswer: z.boolean().optional(),
    defaultAnswer: DefaultAnswer.optional(),

    placeholder: z.string().optional(),

    hasMinCharacters: z.boolean().optional(),
    minCharacters: z.number().optional(),

    hasMaxCharacters: z.boolean().optional(),
    maxCharacters: z.number().optional(),

    // Keep as string to stay 1:1 with docs
    columnListUuid: z.string().optional(),
    columnUuid: z.string().optional(),
    columnRatio: z.number().optional(),

    name: z.string().optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    // If hasDefaultAnswer === true, defaultAnswer must be provided
    if (v.hasDefaultAnswer && !v.defaultAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultAnswer"],
        message: "defaultAnswer is required when hasDefaultAnswer is true",
      });
    }

    // If hasMinCharacters === true, minCharacters must be provided
    if (v.hasMinCharacters && typeof v.minCharacters !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minCharacters"],
        message: "minCharacters is required when hasMinCharacters is true",
      });
    }

    // If hasMaxCharacters === true, maxCharacters must be provided
    if (v.hasMaxCharacters && typeof v.maxCharacters !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxCharacters"],
        message: "maxCharacters is required when hasMaxCharacters is true",
      });
    }

    // If both provided, enforce min <= max
    if (
      typeof v.minCharacters === "number" &&
      typeof v.maxCharacters === "number" &&
      v.minCharacters > v.maxCharacters
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minCharacters"],
        message: "minCharacters cannot be greater than maxCharacters",
      });
    }
  });

export type InputTextPayload = z.infer<typeof InputTextPayload>;
