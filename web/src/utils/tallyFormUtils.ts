import { FormField } from '@/app/components/TallyFormBuilder/TallyFormBuilder';

/**
 * Convert FormFields to Tally blocks format
 *
 * This utility function transforms user-configured form fields into the
 * block structure required by the Tally API.
 *
 * @param formTitle - The title of the form (becomes FORM_TITLE block)
 * @param fields - Array of form fields configured by the user
 * @returns Array of Tally API blocks
 */
export function convertToTallyBlocks(formTitle: string, fields: FormField[]) {
  const blocks = [];

  // 1. FORM_TITLE (always first)
  blocks.push({
    uuid: crypto.randomUUID(),
    type: 'FORM_TITLE',
    groupUuid: crypto.randomUUID(),
    groupType: 'FORM_TITLE',
    payload: {
      html: formTitle
    }
  });

  // 2. User-configured fields
  fields.forEach(field => {
    // INPUT_TEXT: Requires TITLE + INPUT_TEXT pair (separate groupUuids)
    if (field.type === 'INPUT_TEXT') {
      const titleGroupUuid = crypto.randomUUID();
      const inputGroupUuid = crypto.randomUUID();

      // TITLE block with question text
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'TITLE',
        groupUuid: titleGroupUuid,
        groupType: 'QUESTION',
        payload: {
          html: field.label
        }
      });

      // INPUT_TEXT block with configuration
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'INPUT_TEXT',
        groupUuid: inputGroupUuid,
        groupType: 'INPUT_TEXT',
        payload: {
          isRequired: field.required,
          placeholder: field.placeholder || ''
        }
      });
    }

    // TEXTAREA: Same pattern as INPUT_TEXT (TITLE + TEXTAREA pair with separate groupUuids)
    else if (field.type === 'TEXTAREA') {
      const titleGroupUuid = crypto.randomUUID();
      const textareaGroupUuid = crypto.randomUUID();

      // TITLE block with question text
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'TITLE',
        groupUuid: titleGroupUuid,
        groupType: 'QUESTION',
        payload: {
          html: field.label
        }
      });

      // TEXTAREA block with configuration
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'TEXTAREA',
        groupUuid: textareaGroupUuid,
        groupType: 'TEXTAREA',  // CRITICAL: Must be 'TEXTAREA', not 'QUESTION'
        payload: {
          isRequired: field.required,
          placeholder: field.placeholder || ''
        }
      });
    }

    // INPUT_EMAIL: Same pattern as INPUT_TEXT (TITLE + INPUT_EMAIL pair with separate groupUuids)
    else if (field.type === 'INPUT_EMAIL') {
      const titleGroupUuid = crypto.randomUUID();
      const inputEmailGroupUuid = crypto.randomUUID();

      // TITLE block with question text
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'TITLE',
        groupUuid: titleGroupUuid,
        groupType: 'QUESTION',
        payload: {
          html: field.label
        }
      });

      // INPUT_EMAIL block with configuration
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'INPUT_EMAIL',
        groupUuid: inputEmailGroupUuid,
        groupType: 'INPUT_EMAIL',  // CRITICAL: Must be 'INPUT_EMAIL', not 'QUESTION'
        payload: {
          isRequired: field.required,
          placeholder: field.placeholder || ''
        }
      });
    }

    // CHECKBOX: Single checkbox OR checkbox list (with optional TITLE)
    else if (field.type === 'CHECKBOX') {
      const checkboxGroupUuid = crypto.randomUUID();

      // Pattern A: Checkbox list with multiple options
      if (field.options && field.options.length > 0) {
        // Optional TITLE block for the question
        if (field.questionText) {
          const questionGroupUuid = crypto.randomUUID();
          blocks.push({
            uuid: crypto.randomUUID(),
            type: 'TITLE',
            groupUuid: questionGroupUuid,
            groupType: 'QUESTION',
            payload: {
              html: field.questionText  // "Which skills do you have?"
            }
          });
        }

        // Create separate checkbox for each option
        field.options.forEach((optionText, index) => {
          blocks.push({
            uuid: crypto.randomUUID(),
            type: 'CHECKBOX',
            groupUuid: checkboxGroupUuid,  // Same group for all
            groupType: 'CHECKBOXES',
            payload: {
              text: optionText,
              index: index,
              isFirst: index === 0,
              isLast: index === field.options!.length - 1,
              isRequired: field.required,
              // Min/max choices (group-level, inherited by all checkboxes)
              ...(field.minChoices && {
                hasMinChoices: true,
                minChoices: field.minChoices
              }),
              ...(field.maxChoices && {
                hasMaxChoices: true,
                maxChoices: field.maxChoices
              })
            }
          });
        });
      }
      // Pattern B: Single standalone checkbox (existing behavior)
      else {
        blocks.push({
          uuid: crypto.randomUUID(),
          type: 'CHECKBOX',
          groupUuid: checkboxGroupUuid,
          groupType: 'CHECKBOXES',
          payload: {
            text: field.label,  // "I agree to terms"
            index: 0,
            isFirst: true,
            isLast: true,
            isRequired: field.required
          }
        });
      }
    }

    // MULTIPLE_CHOICE_OPTION: Creates TITLE + separate blocks per option
    else if (field.type === 'MULTIPLE_CHOICE_OPTION' && field.options && field.options.length > 0) {
      const questionGroupUuid = crypto.randomUUID();
      const optionsGroupUuid = crypto.randomUUID();

      // TITLE block with question text
      blocks.push({
        uuid: crypto.randomUUID(),
        type: 'TITLE',
        groupUuid: questionGroupUuid,
        groupType: 'QUESTION',
        payload: {
          html: field.label
        }
      });

      // Create separate block for EACH option
      field.options.forEach((optionText, index) => {
        blocks.push({
          uuid: crypto.randomUUID(),
          type: 'MULTIPLE_CHOICE_OPTION',
          groupUuid: optionsGroupUuid,
          groupType: 'MULTIPLE_CHOICE_OPTION',
          payload: {
            text: optionText,
            index: index,
            isFirst: index === 0,
            isLast: index === field.options!.length - 1,
            isRequired: field.required,
            // Allow multiple selection support
            ...(field.allowMultiple && { allowMultiple: true }),
            // Min/max choices (only valid with allowMultiple)
            ...(field.allowMultiple && field.minChoices && {
              hasMinChoices: true,
              minChoices: field.minChoices
            }),
            ...(field.allowMultiple && field.maxChoices && {
              hasMaxChoices: true,
              maxChoices: field.maxChoices
            })
          }
        });
      });
    }

    // TEXT, LABEL, and other simple types: Use html field directly
    else {
      blocks.push({
        uuid: crypto.randomUUID(),
        type: field.type,
        groupUuid: crypto.randomUUID(),
        groupType: field.groupType,
        payload: {
          html: field.label
        }
      });
    }
  });

  return blocks;
}
