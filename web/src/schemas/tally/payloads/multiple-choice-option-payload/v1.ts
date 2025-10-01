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
const BadgeType = z.enum(["OFF", "NUMBERS", "LETTERS"]);

/** defaultAnswer object (present only when hasDefaultAnswer = true) */
const DefaultAnswer = z.object({
  uuid: Uuid,                       // required
  type: FieldType,                  // required
  questionType: QuestionType,       // required
  blockGroupUuid: Uuid,             // required
  title: z.string().optional(),
  calculatedFieldType: CalculatedFieldType.optional(),
}).strict();

/** ---------- Payload schema ---------- */
export const MultipleChoiceOptionPayload = z.object({
  isHidden: z.boolean().optional(),
  isRequired: z.boolean().optional(),

  hasDefaultAnswer: z.boolean().optional(),
  defaultAnswer: DefaultAnswer.optional(),  // validate when provided

  index: z.number().optional(),
  isFirst: z.boolean().optional(),
  isLast: z.boolean().optional(),

  colorCodeOptions: z.boolean().optional(),
  color: z.string().optional(),

  hasBadge: z.boolean().optional(),
  badgeType: BadgeType.optional(),

  hasOtherOption: z.boolean().optional(),
  isOtherOption: z.boolean().optional(),

  image: z.string().optional(), // use z.string().url() if it's guaranteed to be a URL

  columnListUuid: Uuid.optional(),
  columnUuid: Uuid.optional(),
  columnRatio: z.number().optional(),

  name: z.string().optional(),
}).strict()
  // Optional cross-field rule: if hasDefaultAnswer=true, defaultAnswer must exist
  .superRefine((val, ctx) => {
    if (val.hasDefaultAnswer && !val.defaultAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultAnswer"],
        message: "defaultAnswer is required when hasDefaultAnswer is true",
      });
    }
  });

export type MultipleChoiceOptionPayload = z.infer<typeof MultipleChoiceOptionPayload>;
