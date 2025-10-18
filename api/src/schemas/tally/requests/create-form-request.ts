import { z } from "zod";
import { Uuid, BaseRequest, TallyBlockType, GroupType } from "./base";

import { FormTitlePayload } from "../payloads/form-title-payload/v1";
import { TitlePayload } from "../payloads/title-payload/v1";
import { TextPayload } from "../payloads/text-payload/v1";
import { LabelPayload } from "../payloads/label-payload/v1";
import { InputTextPayload } from "../payloads/input-text-payload/v2";  // Using v2 (empirically validated)
import { TextareaPayload } from "../payloads/textarea-payload/v1";
import { InputEmailPayload } from "../payloads/input-email-payload/v1";
import { InputPhoneNumberPayload } from "../payloads/input-phone-number-payload/v1";
import { MultipleChoiceOptionPayload } from "../payloads/multiple-choice-option-payload/v2";  // Using v2 (empirically validated)
import { CheckboxPayload } from "../payloads/checkbox-payload/v2";  // Using v2 (empirically validated)

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
// 5. Build and test with: npm run build && node your-test-script-here.js
const Block = z.discriminatedUnion("type", [
  z.object({
    uuid: Uuid,
    type: z.literal("FORM_TITLE"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: FormTitlePayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("TEXT"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: TextPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("LABEL"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: LabelPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("TITLE"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: TitlePayload,
  }).passthrough(),  // Allow undocumented fields
  z.object({
    uuid: Uuid,
    type: z.literal("INPUT_TEXT"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: InputTextPayload,  // Using v2 schema (reverse engineered from real API)
  }).passthrough(),  // Allow undocumented fields from Tally API
  z.object({
    uuid: Uuid,
    type: z.literal("TEXTAREA"),
    groupUuid: Uuid,
    groupType: GroupType,
    payload: TextareaPayload,
  }).passthrough(),
  z.object({
    uuid: Uuid,
    type: z.literal("INPUT_EMAIL"),
    groupUuid: Uuid,
    groupType: GroupType,
    payload: InputEmailPayload,
  }).passthrough(),
  z.object({
    uuid: Uuid,
    type: z.literal("INPUT_PHONE_NUMBER"),
    groupUuid: Uuid,
    groupType: GroupType,
    payload: InputPhoneNumberPayload,
  }).passthrough(),
  z.object({
    uuid: Uuid,
    type: z.literal("MULTIPLE_CHOICE_OPTION"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: MultipleChoiceOptionPayload,  // Using v2 schema (reverse engineered from real API)
  }).passthrough(),  // Allow undocumented fields from Tally API
  z.object({
    uuid: Uuid,
    type: z.literal("CHECKBOX"),
    groupUuid: Uuid,
    groupType: GroupType,  // Strict validation of known groupType values
    payload: CheckboxPayload,  // Using v2 schema (reverse engineered from real API)
  }).passthrough(),  // Allow undocumented fields from Tally API
]);

export const CreateFormRequest = BaseRequest.extend({
  name: z.string().optional(),  // Optional form name/title
  // status from BaseRequest
  blocks: z.array(Block).min(1),
}).strict();

export type CreateFormRequest = z.infer<typeof CreateFormRequest>;
export type CreateFormBlock = z.infer<typeof Block>;
