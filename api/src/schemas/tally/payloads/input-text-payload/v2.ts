import { z } from "zod";

const Uuid = z.string().uuid();

/**
 * InputTextPayload v2 Schema
 *
 * This schema is based on reverse engineering of the Tally API.
 * Created by fetching a comprehensive test form and analyzing
 * the actual API response structure.
 *
 * Date: 2025-10-06
 * Test Form: "InputTextPayload Reverse Engineer"
 * Coverage: Various INPUT_TEXT configurations testing all features
 *
 * CRITICAL DISCOVERY vs v1 Schema:
 *
 * DEFAULT ANSWER FORMAT
 * - v1: Complex object with uuid, type, questionType, blockGroupUuid, etc.
 * - Actual: Simple string matching the default text value
 * - Example: `"this is the default answer"`
 *
 * This is the SAME pattern as MULTIPLE_CHOICE_OPTION v2!
 * The v1 schema would FAIL in production with the complex object structure.
 *
 * FIELD VALIDATION:
 *
 * All fields from v1 schema are CONFIRMED in actual API:
 * ✅ isRequired
 * ✅ hasDefaultAnswer + defaultAnswer (simple string)
 * ✅ hasMinCharacters + minCharacters
 * ✅ hasMaxCharacters + maxCharacters
 * ✅ placeholder
 * ✅ isHidden, name, column fields
 */
export const InputTextPayload = z
  .object({
    /**
     * Hide this field conditionally (for conditional logic)
     */
    isHidden: z.boolean().optional(),

    /**
     * Whether this field is required to submit the form
     */
    isRequired: z.boolean().optional(),

    /**
     * Feature flag: Does this field have a default answer?
     * When true, `defaultAnswer` must be present
     */
    hasDefaultAnswer: z.boolean().optional(),

    /**
     * Default answer text that pre-fills the input field
     *
     * CRITICAL: v1 expected complex object, but actual API uses SIMPLE STRING
     * This is the same pattern as MULTIPLE_CHOICE_OPTION v2
     *
     * Example: "this is the default answer"
     */
    defaultAnswer: z.string().optional(),

    /**
     * Placeholder text shown in empty input field
     * Example: "Enter your name"
     */
    placeholder: z.string().optional(),

    /**
     * Feature flag: Does this field have a minimum character requirement?
     * When true, `minCharacters` must be present
     */
    hasMinCharacters: z.boolean().optional(),

    /**
     * Minimum number of characters required
     * Only present when hasMinCharacters=true
     */
    minCharacters: z.number().optional(),

    /**
     * Feature flag: Does this field have a maximum character limit?
     * When true, `maxCharacters` must be present
     */
    hasMaxCharacters: z.boolean().optional(),

    /**
     * Maximum number of characters allowed
     * Only present when hasMaxCharacters=true
     */
    maxCharacters: z.number().optional(),

    // ========================================
    // LAYOUT FIELDS
    // ========================================

    /**
     * UUID of the column list for multi-column layouts
     */
    columnListUuid: Uuid.optional(),

    /**
     * UUID of the specific column this field belongs to
     */
    columnUuid: Uuid.optional(),

    /**
     * Ratio/width of the column (for responsive layouts)
     */
    columnRatio: z.number().optional(),

    /**
     * Internal name/identifier for this field
     */
    name: z.string().optional(),
  })
  .passthrough() // Allow undocumented fields for future-proofing
  .superRefine((val, ctx) => {
    // ========================================
    // CONDITIONAL FIELD VALIDATIONS
    // ========================================

    // Validation: If hasDefaultAnswer=true, defaultAnswer must be provided
    if (val.hasDefaultAnswer && !val.defaultAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultAnswer"],
        message: "defaultAnswer is required when hasDefaultAnswer is true",
      });
    }

    // Validation: If hasMinCharacters=true, minCharacters must be provided
    if (val.hasMinCharacters && typeof val.minCharacters !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minCharacters"],
        message: "minCharacters is required when hasMinCharacters is true",
      });
    }

    // Validation: If hasMaxCharacters=true, maxCharacters must be provided
    if (val.hasMaxCharacters && typeof val.maxCharacters !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxCharacters"],
        message: "maxCharacters is required when hasMaxCharacters is true",
      });
    }

    // Validation: minCharacters cannot exceed maxCharacters
    if (
      typeof val.minCharacters === "number" &&
      typeof val.maxCharacters === "number" &&
      val.minCharacters > val.maxCharacters
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minCharacters"],
        message: "minCharacters cannot be greater than maxCharacters",
      });
    }
  });

export type InputTextPayload = z.infer<typeof InputTextPayload>;

/**
 * USAGE NOTES:
 *
 * 1. BASIC TEXT INPUT:
 *    ```typescript
 *    {
 *      type: "INPUT_TEXT",
 *      groupUuid: uuid(),
 *      groupType: "INPUT_TEXT",
 *      payload: {
 *        isRequired: true,
 *        placeholder: "Enter your name"
 *      }
 *    }
 *    ```
 *
 * 2. WITH DEFAULT ANSWER:
 *    Use simple string (not complex object from v1!)
 *    ```typescript
 *    {
 *      payload: {
 *        isRequired: true,
 *        hasDefaultAnswer: true,
 *        defaultAnswer: "John Doe",  // Simple string!
 *        placeholder: "Enter your name"
 *      }
 *    }
 *    ```
 *
 * 3. WITH CHARACTER LIMITS:
 *    ```typescript
 *    {
 *      payload: {
 *        isRequired: true,
 *        hasMinCharacters: true,
 *        minCharacters: 5,
 *        hasMaxCharacters: true,
 *        maxCharacters: 15,
 *        placeholder: "Enter 5-15 characters"
 *      }
 *    }
 *    ```
 *
 * 4. VERIFICATION:
 *    Empirically tested with:
 *    - Test form
 *
 *    Tests confirm:
 *    - defaultAnswer uses simple string format (not complex object)
 *    - All v1 fields are accurate (except defaultAnswer type)
 *    - No undocumented fields discovered
 */
