import { z } from "zod";

const Uuid = z.string().uuid();

/**
 * MultipleChoiceOptionPayload v2 Schema
 *
 * This schema is based on reverse engineering of the Tally API.
 * Created by fetching a comprehensive test form and analyzing
 * the actual API response structure.
 *
 * Date: 2025-10-03
 * Test Form: "MultipleChoiceOptionPayload Reverse Engineer"
 * Coverage: Multiple radio button groups testing various feature combinations
 *
 * CRITICAL DISCOVERIES vs v1 Schema:
 *
 * 1. PRIMARY LABEL FIELD
 *    - v1: No `text` field defined
 *    - Actual: `text` (string) ← This is the actual field used (same as CHECKBOX!)
 *
 * 2. ALLOW MULTIPLE SELECTION (NEW FIELD!)
 *    - v1: Not mentioned
 *    - Actual: `allowMultiple` (boolean) ← Converts radio buttons into checkboxes!
 *    - When true: Enables min/max choice constraints (like CHECKBOX behavior)
 *
 * 3. DEFAULT ANSWER FORMAT
 *    - v1: Complex object with uuid, type, questionType, blockGroupUuid, etc.
 *    - Actual: Simple string matching option text ← Much simpler!
 *    - Example: `"Second option (set as default)"`
 *
 * 4. LOCK IN PLACE
 *    - v1: Not mentioned
 *    - Actual: `lockInPlace` (array of UUIDs) ← Same as CHECKBOX
 *    - Works with `randomize: true`
 *
 * 5. IMAGE SUPPORT
 *    - v1: `image: z.string().optional()`
 *    - Actual: Supports both URLs AND base64 encoded images
 *    - Example: `"data:image/jpeg;base64,..."`
 *
 * 6. COLOR CODING
 *    - v1: `colorCodeOptions` and `color` mentioned
 *    - Actual: Confirmed - `colorCodeOptions: true` (group), `color: "yellow"` (individual)
 *
 * 7. INDEX/POSITION FIELDS (CRITICAL!)
 *    - Just like CHECKBOX: `index`, `isFirst`, `isLast` must be manually set
 *    - Tally does NOT auto-calculate from array position
 *    - See CHECKBOX v2 test results for proof
 *
 * FIELD CATEGORIES:
 *
 * [REQUIRED FOR POST] - Must be provided when creating options:
 *   - text (label), index (position), isFirst (boolean), isLast (boolean)
 *   - NOTE: Tally does NOT auto-calculate index/isFirst/isLast - you MUST set them!
 *
 * [ALWAYS PRESENT IN GET] - Core fields in every option:
 *   - index, isRequired, isFirst, isLast, text
 *
 * [CONDITIONAL - Multi-Selection Mode] - Present when allowMultiple=true:
 *   - hasMinChoices, minChoices, hasMaxChoices, maxChoices
 *   - NOTE: These are ONLY valid when allowMultiple=true!
 *
 * [CONDITIONAL - Group Features] - Present when group has these enabled:
 *   - hasDefaultAnswer, defaultAnswer
 *   - hasOtherOption (when "Other" option enabled)
 *   - randomize (randomize option order)
 *   - lockInPlace (array of locked option UUIDs)
 *   - colorCodeOptions (enable color coding)
 *   - hasBadge, badgeType (number/letter badges)
 *
 * [CONDITIONAL - Item-Specific] - Present only on specific options:
 *   - isOtherOption (only on the "Other" option)
 *   - color (when manually set for this option)
 *   - image (when image attached to this option)
 */
export const MultipleChoiceOptionPayload = z
  .object({
    // ========================================
    // CORE FIELDS (Always Present)
    // ========================================

    /**
     * Position index within the option group (0-based)
     * First option = 0, second = 1, etc.
     *
     * CRITICAL: You MUST manually set this when creating options!
     * Tally does NOT auto-calculate - if omitted, field will be undefined.
     *
     * Example for 3 options: [0, 1, 2]
     */
    index: z.number(),

    /**
     * Whether this option must be selected to submit the form
     * Inherited from group-level setting
     */
    isRequired: z.boolean(),

    /**
     * Flag indicating if this is the first option in the group
     * Used by Tally for rendering and validation logic
     *
     * CRITICAL: You MUST manually set this when creating options!
     * Tally does NOT auto-calculate - if omitted, field will be undefined.
     *
     * Example: First option = true, others = false
     */
    isFirst: z.boolean(),

    /**
     * Flag indicating if this is the last option in the group
     * Used by Tally for rendering and validation logic
     *
     * CRITICAL: You MUST manually set this when creating options!
     * Tally does NOT auto-calculate - if omitted, field will be undefined.
     *
     * Example: Last option = true, others = false
     */
    isLast: z.boolean(),

    /**
     * The option label text displayed to users
     * CRITICAL: This is the actual field used (same as CHECKBOX `text` field)
     */
    text: z.string(),

    // ========================================
    // MULTI-SELECTION MODE (NEW!)
    // ========================================

    /**
     * Enable multiple selection (converts radio buttons into checkboxes!)
     * CRITICAL DISCOVERY: This makes MULTIPLE_CHOICE_OPTION behave like CHECKBOXES
     *
     * When true:
     * - Users can select multiple options (checkbox behavior)
     * - hasMinChoices, minChoices, hasMaxChoices, maxChoices become valid
     * - Otherwise behaves like radio buttons (single selection only)
     */
    allowMultiple: z.boolean().optional(),

    // ========================================
    // CONDITIONAL FIELDS - Multi-Selection Constraints
    // ========================================

    /**
     * Feature flag: Does this group have a minimum choice requirement?
     * ONLY valid when allowMultiple=true
     */
    hasMinChoices: z.boolean().optional(),

    /**
     * Minimum number of options that must be selected
     * Only present when hasMinChoices=true AND allowMultiple=true
     */
    minChoices: z.number().optional(),

    /**
     * Feature flag: Does this group have a maximum choice limit?
     * ONLY valid when allowMultiple=true
     */
    hasMaxChoices: z.boolean().optional(),

    /**
     * Maximum number of options that can be selected
     * Only present when hasMaxChoices=true AND allowMultiple=true
     */
    maxChoices: z.number().optional(),

    // ========================================
    // CONDITIONAL FIELDS - Group Features
    // ========================================

    /**
     * Feature flag: Does this group have a default answer?
     * When true, `defaultAnswer` field must be present
     */
    hasDefaultAnswer: z.boolean().optional(),

    /**
     * Default selected option (pre-selected)
     * CRITICAL: v1 expected complex object, but actual API uses SIMPLE STRING
     * The string should match the `text` value of the default option
     *
     * Example: "Second option (set as default)"
     */
    defaultAnswer: z.string().optional(),

    /**
     * Feature flag: Does this group have an "Other" option?
     * When true, one option will have isOtherOption=true
     */
    hasOtherOption: z.boolean().optional(),

    /**
     * Whether options should be displayed in random order
     * Compatible with lockInPlace (locked items remain fixed)
     */
    randomize: z.boolean().optional(),

    /**
     * Array of option UUIDs that should remain in fixed positions
     * When randomize=true, options with UUIDs in this array won't be randomized
     *
     * Example: ["uuid1", "uuid2"] locks those options in place
     */
    lockInPlace: z.array(z.string().uuid()).optional(),

    /**
     * Enable color coding for options
     * When true, options can have individual colors
     */
    colorCodeOptions: z.boolean().optional(),

    /**
     * Individual option color (when colorCodeOptions=true and manually set)
     * Example: "yellow", "red", "green"
     */
    color: z.string().optional(),

    /**
     * Feature flag: Does this group have badges?
     * When true, badgeType specifies the badge style
     */
    hasBadge: z.boolean().optional(),

    /**
     * Badge style: Letters (A, B, C...), Numbers (1, 2, 3...), or Off
     */
    badgeType: z.enum(["LETTERS", "NUMBERS", "OFF"]).optional(),

    // ========================================
    // CONDITIONAL FIELDS - Item-Specific
    // ========================================

    /**
     * Marks this option as the "Other" option (allows custom user input)
     * Only present on the option designated as "Other"
     */
    isOtherOption: z.boolean().optional(),

    /**
     * Image attachment for this option
     * SUPPORTS: Both URLs and base64 encoded images
     *
     * Examples:
     * - URL: "https://images.unsplash.com/..."
     * - Base64: "data:image/jpeg;base64,/9j/4AAQ..."
     */
    image: z.string().optional(),

    // ========================================
    // LAYOUT FIELDS
    // ========================================

    /**
     * UUID of the column list for multi-column layouts
     */
    columnListUuid: Uuid.optional(),

    /**
     * UUID of the specific column this option belongs to
     */
    columnUuid: Uuid.optional(),

    /**
     * Ratio/width of the column (for responsive layouts)
     */
    columnRatio: z.number().optional(),

    // ========================================
    // OPTIONAL FIELDS
    // ========================================

    /**
     * Hide option conditionally in form (for conditional logic)
     */
    isHidden: z.boolean().optional(),

    /**
     * Internal name/identifier for this option
     */
    name: z.string().optional(),
  })
  .passthrough() // Allow undiscovered fields to prevent data loss
  .superRefine((data, ctx) => {
    // ========================================
    // CONDITIONAL FIELD VALIDATIONS
    // ========================================

    // Validation: If hasDefaultAnswer=true, defaultAnswer must be present
    if (data.hasDefaultAnswer === true && data.defaultAnswer === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultAnswer"],
        message: "defaultAnswer is required when hasDefaultAnswer is true",
      });
    }

    // Validation: Min/max choices only valid when allowMultiple=true
    if (!data.allowMultiple && (data.hasMinChoices || data.hasMaxChoices)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allowMultiple"],
        message: "hasMinChoices/hasMaxChoices are only valid when allowMultiple is true",
      });
    }

    // Validation: If allowMultiple=true and hasMinChoices=true, minChoices must exist
    if (data.allowMultiple && data.hasMinChoices === true && data.minChoices === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minChoices"],
        message: "minChoices is required when hasMinChoices is true (in multi-select mode)",
      });
    }

    // Validation: If allowMultiple=true and hasMaxChoices=true, maxChoices must exist
    if (data.allowMultiple && data.hasMaxChoices === true && data.maxChoices === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxChoices"],
        message: "maxChoices is required when hasMaxChoices is true (in multi-select mode)",
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

export type MultipleChoiceOptionPayload = z.infer<typeof MultipleChoiceOptionPayload>;

/**
 * USAGE NOTES:
 *
 * 1. CREATING RADIO BUTTONS (Single Selection):
 *    CRITICAL: You MUST manually set index, isFirst, isLast for EACH option!
 *    Tally does NOT auto-calculate these fields. If omitted, they will be undefined.
 *
 *    Example for creating a radio button group:
 *    ```typescript
 *    const options = [
 *      { text: "Option 1", index: 0, isFirst: true,  isLast: false, isRequired: false },
 *      { text: "Option 2", index: 1, isFirst: false, isLast: false, isRequired: false },
 *      { text: "Option 3", index: 2, isFirst: false, isLast: true,  isRequired: false }
 *    ];
 *    ```
 *
 *    Helper function for generating option arrays:
 *    ```typescript
 *    function createRadioGroup(options: string[], isRequired = false) {
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
 * 2. CREATING CHECKBOXES (Multi-Selection):
 *    Set `allowMultiple: true` to convert into checkboxes
 *    ```typescript
 *    const options = createRadioGroup(["A", "B", "C"]).map(opt => ({
 *      ...opt,
 *      allowMultiple: true,
 *      hasMinChoices: true,
 *      minChoices: 1,
 *      hasMaxChoices: true,
 *      maxChoices: 2
 *    }));
 *    ```
 *
 * 3. DEFAULT ANSWER:
 *    Use simple string matching option text:
 *    ```typescript
 *    {
 *      text: "Option 2",
 *      hasDefaultAnswer: true,
 *      defaultAnswer: "Option 2"  // String, not complex object!
 *    }
 *    ```
 *
 * 4. FEATURE COMBINATIONS:
 *    - randomize + lockInPlace: Compatible! Locked items stay in place
 *    - allowMultiple + min/max choices: Only valid together
 *    - colorCodeOptions + individual colors: Can set per-option or use default scheme
 *    - hasOtherOption: Creates additional option with isOtherOption=true
 *
 * 5. BADGE BEHAVIOR:
 *    IMPORTANT: Always explicitly set hasBadge and badgeType!
 *
 *    **Issue:** If omitted, Tally may apply default badges incorrectly (all options show 'A')
 *    **Solution:** Always specify both fields:
 *    ```typescript
 *    // Enable badges
 *    { hasBadge: true, badgeType: "LETTERS" }
 *
 *    // Disable badges
 *    { hasBadge: false, badgeType: "OFF" }
 *    ```
 *
 * 6. VERIFICATION:
 *    Empirically tested with:
 *    - Test form
 *
 *    Tests confirm:
 *    - Same behavior as CHECKBOX for index/isFirst/isLast (must manually set)
 *    - defaultAnswer uses simple string format (not complex object)
 *    - allowMultiple feature works (converts to checkbox behavior)
 *    - Explicit badge settings required for correct rendering
 */
