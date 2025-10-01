import { z } from "zod";

/** Reusable primitives */
const Uuid = z.uuid();
const Uri  = z.url();

/** Enums */
const FieldType = z.enum(["InputField", "CalculatedField", "HiddenField"]);

const QuestionType = z.enum([
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
] as const);

const CalculatedFieldType = z.enum(["NUMBER", "TEXT"]);

/** ---------- Payload schema ---------- */
export const FormTitlePayload = z
  .object({
    html: z.string().optional(),
    logo: Uri.optional(),
    cover: Uri.optional(),

    coverSettings: z
      .object({
        objectPositionYPercent: z.number(),
      })
      .strict()
      .optional(),

    mentions: z
      .array(
        z
          .object({
            uuid: Uuid,
            field: z
              .object({
                uuid: Uuid,
                type: FieldType,
                questionType: QuestionType,
                blockGroupUuid: Uuid,
                title: z.string().optional(),
                calculatedFieldType: CalculatedFieldType.optional(),
                /** “Any value”, can be null, and optional */
                defaultValue: z.any().nullable().optional(),
              })
              .strict(),
          })
          .strict()
      )
      .optional(),

    button: z
      .object({
        label: z.string(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type FormTitlePayload = z.infer<typeof FormTitlePayload>;

// export const FormTitlePayload = z.object({
//   html: z.string().optional(),
//   logo: z.string().url().optional()
// }).strict();
// export type FormTitlePayload = z.infer<typeof FormTitlePayload>;
