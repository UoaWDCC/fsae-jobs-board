import { z } from "zod";
import { Uuid, BaseRequest, SupportedGroupTypes } from "./base";

import { FormTitlePayload } from "../payloads/form-title-payload/v1";
import { TextPayload } from "../payloads/text-payload/v1";
import { LabelPayload } from "../payloads/label-payload/v1";
import { InputTextPayload } from "../payloads/input-text-payload/v1";
import { MultipleChoiceOptionPayload } from "../payloads/multiple-choice-option-payload/v1";
import { CheckboxPayload } from "../payloads/checkbox-payload/v1";

// Discriminated union of blocks by groupType; keep type in sync with groupType
const Block = z.discriminatedUnion("groupType", [
  z.object({
    uuid: Uuid,
    type: z.literal("FORM_TITLE"),
    groupUuid: Uuid,
    groupType: z.literal("FORM_TITLE"),
    payload: FormTitlePayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("TEXT"),
    groupUuid: Uuid,
    groupType: z.literal("TEXT"),
    payload: TextPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("LABEL"),
    groupUuid: Uuid,
    groupType: z.literal("LABEL"),
    payload: LabelPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("INPUT_TEXT"),
    groupUuid: Uuid,
    groupType: z.literal("INPUT_TEXT"),
    payload: InputTextPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("MULTIPLE_CHOICE_OPTION"),
    groupUuid: Uuid,
    groupType: z.literal("MULTIPLE_CHOICE_OPTION"),
    payload: MultipleChoiceOptionPayload,
  }).strict(),
  z.object({
    uuid: Uuid,
    type: z.literal("CHECKBOX"),
    groupUuid: Uuid,
    groupType: z.literal("CHECKBOX"),
    payload: CheckboxPayload,
  }).strict(),
]);

export const CreateFormRequest = BaseRequest.extend({
  // status from BaseRequest
  blocks: z.array(Block).min(1),
}).strict();

export type CreateFormRequest = z.infer<typeof CreateFormRequest>;
export type CreateFormBlock = z.infer<typeof Block>;
