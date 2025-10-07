import { z } from "zod";
import { Uuid, BaseRequest, TallyBlockType } from "./base";

import { FormTitlePayload } from "../payloads/form-title-payload/v1";
import { TextPayload } from "../payloads/text-payload/v1";
import { LabelPayload } from "../payloads/label-payload/v1";
import { InputTextPayload } from "../payloads/input-text-payload/v1";
import { MultipleChoiceOptionPayload } from "../payloads/multiple-choice-option-payload/v1";
import { CheckboxPayload } from "../payloads/checkbox-payload/v1";

// Discriminated union of blocks by 'type' field
// The 'type' field determines the payload structure
// The 'groupType' field can be any valid TallyBlockType value
//
// HOW TO ADD NEW BLOCK TYPES:
// 1. Create payload schema: /payloads/[type-name]-payload/v1.ts
// 2. Import the payload schema at the top of this file
// 3. Add a new case to the discriminated union below:
//    z.object({
//      uuid: Uuid,
//      type: z.literal("NEW_TYPE"),
//      groupUuid: Uuid,
//      groupType: TallyBlockType,
//      payload: NewTypePayload,
//    }).strict(),
// 4. Update SupportedBlockTypes in base.ts if needed
// 5. Copy changes to backend: /api/src/schemas/tally/
// 6. Build and test with: npm run build && node test-validation.js
const Block = z.discriminatedUnion("type", [
  z.object({
    uuid: Uuid,
    type: z.literal("FORM_TITLE"),
    groupUuid: Uuid,
    groupType: TallyBlockType,  // Flexible - any valid Tally groupType
    payload: FormTitlePayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("TEXT"),
    groupUuid: Uuid,
    groupType: TallyBlockType,  // Flexible - any valid Tally groupType
    payload: TextPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("LABEL"),
    groupUuid: Uuid,
    groupType: TallyBlockType,  // Flexible - any valid Tally groupType
    payload: LabelPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("INPUT_TEXT"),
    groupUuid: Uuid,
    groupType: TallyBlockType,  // Flexible - any valid Tally groupType
    payload: InputTextPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("MULTIPLE_CHOICE_OPTION"),
    groupUuid: Uuid,
    groupType: TallyBlockType,  // Flexible - any valid Tally groupType
    payload: MultipleChoiceOptionPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("CHECKBOX"),
    groupUuid: Uuid,
    groupType: TallyBlockType,  // Flexible - any valid Tally groupType
    payload: CheckboxPayload,
  }).strict(),
]);

export const CreateFormRequest = BaseRequest.extend({
  // status from BaseRequest
  blocks: z.array(Block).min(1),
}).strict();

export type CreateFormRequest = z.infer<typeof CreateFormRequest>;
export type CreateFormBlock = z.infer<typeof Block>;
