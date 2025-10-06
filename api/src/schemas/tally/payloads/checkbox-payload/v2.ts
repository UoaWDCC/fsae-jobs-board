import { z } from "zod";

const Uuid = z.string().uuid();

/**
 * CheckboxPayload v2 Schema
 *
 * This schema is based on reverse engineering of the Tally API.
 * Created by fetching test forms and analyzing
 * the actual API response structure.
 *
 * Date: 2025-01-03
 * Test Form: "Checkbox Reverse Engineer"
 * Coverage: 5 checkbox groups testing various feature combinations
 *
 * CRITICAL DISCOVERIES vs Official Documentation:
 *
 * 1. PRIMARY LABEL FIELD
 *    - Documented: `label` (string)
 *    - Actual: `text` (string) ← This is the actual field used
 *
 * 2. LOCK IN PLACE
 *    - Documented: Not mentioned
 *    - Actual: `lockInPlace` (array of UUIDs) ← ARRAY, not boolean!
 *    - Contains UUIDs of checkboxes that should remain in fixed positions
 *
 * 3. OTHER OPTION MARKER
 *    - Documented: Only `hasOtherOption` mentioned
 *    - Actual: `isOtherOption` (boolean) ← Separate field marking the "Other" checkbox itself
 *
 * 4. IMAGE ATTACHMENTS
 *    - Documented: Not mentioned in checkbox payload docs
 *    - Actual: `image` (string URL) ← Direct URL to uploaded image
 *
 * 5. FEATURE FLAG SCOPE
 *    - Expected: Feature flags might only appear on first checkbox in group
 *    - Actual: ALL checkboxes in a group inherit the same feature flags
 *    - Example: If group has minChoices=2, ALL checkboxes have hasMinChoices=true, minChoices=2
 *
 * 6. RANDOMIZATION
 *    - Documented: Not mentioned
 *    - Actual: `randomize` (boolean) ← Controls if checkbox order is randomized
 *    - Compatible with lockInPlace (locked items stay in place even when randomized)
 *
 * FIELD CATEGORIES:
 *
 * [REQUIRED FOR POST] - Must be provided when creating checkboxes:
 *   - text (label), index (position), isFirst (boolean), isLast (boolean)
 *   - NOTE: Tally does NOT auto-calculate index/isFirst/isLast - you MUST set them!
 *
 * [ALWAYS PRESENT IN GET] - Core fields that appear on every checkbox in responses:
 *   - index, isRequired, isFirst, isLast, text
 *
 * [CONDITIONAL - Group Features] - Present when group has these features enabled:
 *   - hasMinChoices, minChoices (when min choice constraint set)
 *   - hasMaxChoices, maxChoices (when max choice constraint set)
 *   - hasDefaultAnswer, defaultAnswer (when default answer configured)
 *   - hasOtherOption (when "Other" option enabled for group)
 *   - randomize (when randomization enabled for group)
 *   - lockInPlace (when any checkbox in group is locked)
 *
 * [CONDITIONAL - Item-Specific] - Present only on specific checkboxes:
 *   - isOtherOption (only on the "Other" checkbox)
 *   - image (only on checkboxes with image attachments)
 *
 * [LAYOUT] - From official docs, for column layouts:
 *   - columnListUuid, columnUuid, columnRatio
 *
 * [OPTIONAL/LEGACY] - From docs but not seen in test:
 *   - label (use `text` instead)
 *   - defaultChecked (use `hasDefaultAnswer` + `defaultAnswer` instead)
 *   - isHidden (for conditional logic)
 *   - name (internal identifier)
 */
export const CheckboxPayload = z
  .object({
    // ========================================
    // CORE FIELDS (Always Present)
    // ========================================

    /**
     * Position index within the checkbox group (0-based)
     * First checkbox in group = 0, second = 1, etc.
     *
     * CRITICAL: You MUST manually set this when creating checkboxes!
     * Tally does NOT auto-calculate - if omitted, field will be undefined.
     *
     * Example for 3 checkboxes: [0, 1, 2]
     */
    index: z.number(),

    /**
     * Whether this checkbox must be checked to submit the form
     * Inherited from group-level setting - all checkboxes in same group share this value
     */
    isRequired: z.boolean(),

    /**
     * Flag indicating if this is the first checkbox in the group
     * Used by Tally for rendering and validation logic
     *
     * CRITICAL: You MUST manually set this when creating checkboxes!
     * Tally does NOT auto-calculate - if omitted, field will be undefined.
     *
     * Example: First checkbox = true, others = false
     */
    isFirst: z.boolean(),

    /**
     * Flag indicating if this is the last checkbox in the group
     * Used by Tally for rendering and validation logic
     *
     * CRITICAL: You MUST manually set this when creating checkboxes!
     * Tally does NOT auto-calculate - if omitted, field will be undefined.
     *
     * Example: Last checkbox = true, others = false
     */
    isLast: z.boolean(),

    /**
     * The checkbox label text displayed to users
     * CRITICAL: This is the actual field used (not `label` as documented)
     */
    text: z.string(),

    // ========================================
    // CONDITIONAL FIELDS - Group Features
    // ========================================

    /**
     * Feature flag: Does this group have a minimum choice requirement?
     * When true, `minChoices` field must be present
     */
    hasMinChoices: z.boolean().optional(),

    /**
     * Minimum number of checkboxes that must be selected
     * Only present when hasMinChoices=true
     */
    minChoices: z.number().optional(),

    /**
     * Feature flag: Does this group have a maximum choice limit?
     * When true, `maxChoices` field must be present
     */
    hasMaxChoices: z.boolean().optional(),

    /**
     * Maximum number of checkboxes that can be selected
     * Only present when hasMaxChoices=true
     */
    maxChoices: z.number().optional(),

    /**
     * Feature flag: Does this group have a default answer?
     * When true, `defaultAnswer` field must be present
     */
    hasDefaultAnswer: z.boolean().optional(),

    /**
     * Identifier for the default selected option
     * Only present when hasDefaultAnswer=true
     * Value appears to be a string identifier (e.g., "default_answer_option")
     */
    defaultAnswer: z.string().optional(),

    /**
     * Feature flag: Does this group have an "Other" option?
     * When true, one checkbox in the group will have isOtherOption=true
     */
    hasOtherOption: z.boolean().optional(),

    /**
     * Whether checkbox options should be displayed in random order
     * UNDOCUMENTED but functional
     * Compatible with lockInPlace (locked items remain in fixed positions)
     */
    randomize: z.boolean().optional(),

    /**
     * Array of checkbox UUIDs that should remain in fixed positions
     * CRITICAL DISCOVERY: This is an ARRAY, not a boolean!
     *
     * When randomize=true, checkboxes with UUIDs in this array
     * will NOT be randomized and stay in their configured positions
     *
     * Example: ["uuid1", "uuid2"] locks those two checkboxes in place
     */
    lockInPlace: z.array(z.string().uuid()).optional(),

    // ========================================
    // CONDITIONAL FIELDS - Item-Specific
    // ========================================

    /**
     * Marks this checkbox as the "Other" option (allows custom user input)
     * UNDOCUMENTED field
     * Only present on the checkbox designated as "Other"
     */
    isOtherOption: z.boolean().optional(),

    /**
     * URL to an image attachment for this checkbox option
     * UNDOCUMENTED field
     * Direct URL string (e.g., Unsplash image URL)
     */
    image: z.string().url().optional(),

    // ========================================
    // LAYOUT FIELDS (From Documentation)
    // ========================================

    /**
     * UUID of the column list for multi-column layouts
     * From official documentation
     */
    columnListUuid: Uuid.optional(),

    /**
     * UUID of the specific column this checkbox belongs to
     * From official documentation
     */
    columnUuid: Uuid.optional(),

    /**
     * Ratio/width of the column (for responsive layouts)
     * From official documentation
     */
    columnRatio: z.number().optional(),

    // ========================================
    // LEGACY/OPTIONAL FIELDS (From Docs)
    // ========================================

    /**
     * Display text next to checkbox (legacy field from documentation)
     * In practice, `text` field is used instead
     * Kept for backward compatibility
     */
    label: z.string().optional(),

    /**
     * Pre-checked by default (legacy field from documentation)
     * In practice, hasDefaultAnswer + defaultAnswer are used instead
     * Kept for backward compatibility
     */
    defaultChecked: z.boolean().optional(),

    /**
     * Hide checkbox conditionally in form (for conditional logic)
     * From official documentation
     */
    isHidden: z.boolean().optional(),

    /**
     * Internal name/identifier for this checkbox
     * From official documentation
     */
    name: z.string().optional(),
  })
  .passthrough() // Allow undiscovered fields to prevent data loss
  .superRefine((data, ctx) => {
    // ========================================
    // CONDITIONAL FIELD VALIDATIONS
    // ========================================

    // Validation: If hasMinChoices=true, minChoices must be present
    if (data.hasMinChoices === true && data.minChoices === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minChoices"],
        message: "minChoices is required when hasMinChoices is true",
      });
    }

    // Validation: If hasMaxChoices=true, maxChoices must be present
    if (data.hasMaxChoices === true && data.maxChoices === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxChoices"],
        message: "maxChoices is required when hasMaxChoices is true",
      });
    }

    // Validation: If hasDefaultAnswer=true, defaultAnswer must be present
    if (data.hasDefaultAnswer === true && data.defaultAnswer === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultAnswer"],
        message: "defaultAnswer is required when hasDefaultAnswer is true",
      });
    }

    // Validation: minChoices cannot exceed maxChoices
    if (
      data.minChoices !== undefined &&
      data.maxChoices !== undefined &&
      data.minChoices > data.maxChoices
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minChoices"],
        message: "minChoices cannot be greater than maxChoices",
      });
    }

    // Validation: minChoices must be at least 1
    if (data.minChoices !== undefined && data.minChoices < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minChoices"],
        message: "minChoices must be at least 1",
      });
    }

    // Validation: maxChoices must be at least 1
    if (data.maxChoices !== undefined && data.maxChoices < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxChoices"],
        message: "maxChoices must be at least 1",
      });
    }
  });

export type CheckboxPayload = z.infer<typeof CheckboxPayload>;

/**
 * USAGE NOTES:
 *
 * 1. CREATING CHECKBOXES:
 *    CRITICAL: You MUST manually set index, isFirst, isLast for EACH checkbox!
 *    Tally does NOT auto-calculate these fields. If omitted, they will be undefined.
 *
 *    Example for creating a checkbox group with 3 options:
 *    ```typescript
 *    const checkboxes = [
 *      { text: "Option 1", index: 0, isFirst: true,  isLast: false, isRequired: false },
 *      { text: "Option 2", index: 1, isFirst: false, isLast: false, isRequired: false },
 *      { text: "Option 3", index: 2, isFirst: false, isLast: true,  isRequired: false }
 *    ];
 *    ```
 *
 *    Helper function for generating checkbox arrays:
 *    ```typescript
 *    function createCheckboxGroup(options: string[], isRequired = false) {
 *      return options.map((text, index) => ({
 *        text,
 *        index,
 *        isFirst: index === 0,
 *        isLast: index === options.length - 1,
 *        isRequired
 *      }));
 *    }
 *    ```
 *
 * 2. FEATURE COMBINATIONS:
 *    - randomize + lockInPlace: Compatible! Locked items stay in place
 *    - hasMinChoices + hasMaxChoices: Can be used together
 *    - hasOtherOption: Creates an additional checkbox with isOtherOption=true
 *
 * 3. GROUP-LEVEL vs ITEM-LEVEL:
 *    Group-level (all checkboxes in group share these):
 *    - isRequired, hasMinChoices, hasMaxChoices, hasDefaultAnswer, hasOtherOption, randomize, lockInPlace
 *
 *    Item-level (specific to individual checkboxes):
 *    - index, isFirst, isLast, text, isOtherOption, image
 *
 * 4. DEFAULT ANSWERS:
 *    Use hasDefaultAnswer=true + defaultAnswer="identifier"
 *    NOT the legacy defaultChecked field
 *
 * 5. VERIFICATION:
 *    Tested via POST and GET requests against Tally API
 *    Confirmed fields behave as expected in live forms
 *    Tests confirm: Tally preserves manual values, does NOT auto-calculate
 */
