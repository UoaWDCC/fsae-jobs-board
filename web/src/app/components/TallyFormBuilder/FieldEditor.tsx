import { Paper, Select, TextInput, Checkbox, Group, ActionIcon, Stack, Button, Text, NumberInput } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconTrash, IconPlus } from '@tabler/icons-react';
import { FormField } from './TallyFormBuilder';

// v1: Only validated field types from backend schemas
const FIELD_TYPES_PHASE_1A = [
  { value: 'TEXT', label: 'Text (instructions/static text)', groupType: 'TEXT' },
  { value: 'LABEL', label: 'Section Label (organize form)', groupType: 'LABEL' },
  { value: 'INPUT_TEXT', label: 'Text Input (short answer)', groupType: 'QUESTION' },
  { value: 'CHECKBOX', label: 'Checkbox (single or list)', groupType: 'QUESTION' },
  { value: 'MULTIPLE_CHOICE_OPTION', label: 'Multiple Choice (radio buttons)', groupType: 'QUESTION' },
];

interface FieldEditorProps {
  field: FormField;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function FieldEditor({
  field,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown
}: FieldEditorProps) {
  const needsOptions = field.type === 'MULTIPLE_CHOICE_OPTION' || field.type === 'CHECKBOX';
  const needsRequired = ['INPUT_TEXT', 'CHECKBOX', 'MULTIPLE_CHOICE_OPTION'].includes(field.type);
  const isStaticField = ['TEXT', 'LABEL'].includes(field.type);
  const isCheckboxList = field.type === 'CHECKBOX' && field.options && field.options.length > 0;

  const handleTypeChange = (value: string | null) => {
    if (!value) return;

    const selectedType = FIELD_TYPES_PHASE_1A.find(t => t.value === value);
    if (!selectedType) return;

    // Prepare updates
    const updates: Partial<FormField> = {
      type: value,
      groupType: selectedType.groupType,
    };

    // Auto-create 1 empty option when CHECKBOX or MULTIPLE_CHOICE selected (if no options exist)
    if ((value === 'CHECKBOX' || value === 'MULTIPLE_CHOICE_OPTION') && (!field.options || field.options.length === 0)) {
      updates.options = [''];
    }

    // Reset options if changing away from MULTIPLE_CHOICE_OPTION or CHECKBOX
    if (value !== 'MULTIPLE_CHOICE_OPTION' && value !== 'CHECKBOX' && field.options) {
      updates.options = undefined;
    }

    // Reset questionText if changing away from CHECKBOX
    if (value !== 'CHECKBOX' && field.questionText) {
      updates.questionText = undefined;
    }

    // Reset allowMultiple if changing away from MULTIPLE_CHOICE_OPTION
    if (value !== 'MULTIPLE_CHOICE_OPTION' && field.allowMultiple) {
      updates.allowMultiple = undefined;
    }

    // Reset min/max if changing away from types that support them
    if (value !== 'CHECKBOX' && value !== 'MULTIPLE_CHOICE_OPTION') {
      if (field.minChoices) updates.minChoices = undefined;
      if (field.maxChoices) updates.maxChoices = undefined;
    }

    onUpdate(updates);
  };

  const getLabelPlaceholder = () => {
    switch (field.type) {
      case 'TEXT':
        return 'Enter instructions or information for applicants...';
      case 'LABEL':
        return 'Enter section header text...';
      case 'INPUT_TEXT':
        return 'What question do you want to ask?';
      case 'CHECKBOX':
        return 'I agree to the terms and conditions';
      case 'MULTIPLE_CHOICE_OPTION':
        return 'Select your preferred start date';
      default:
        return 'Enter field label...';
    }
  };

  // Option management helper functions
  const addOption = () => {
    onUpdate({
      options: [...(field.options || []), '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    // Safety check: Don't allow deletion if only 1 option
    if ((field.options || []).length <= 1) {
      return;
    }

    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    onUpdate({ options: newOptions });
  };

  const moveOption = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= (field.options || []).length) return;

    const newOptions = [...(field.options || [])];
    [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
    onUpdate({ options: newOptions });
  };

  return (
    <Paper p="md" mb="sm" withBorder>
      <Group justify="space-between" align="flex-start" mb="sm">
        <Select
          label="Field Type"
          data={FIELD_TYPES_PHASE_1A}
          value={field.type}
          onChange={handleTypeChange}
          style={{ flex: 1 }}
        />

        <Group gap="xs" mt="xl">
          <ActionIcon
            variant="subtle"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move field up"
          >
            <IconArrowUp size={16} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move field down"
          >
            <IconArrowDown size={16} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            color="red"
            onClick={onRemove}
            aria-label="Remove field"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {field.type !== 'CHECKBOX' && (
        <TextInput
          label={isStaticField ? 'Content' : 'Question Label'}
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder={getLabelPlaceholder()}
          required
        />
      )}

      {field.type === 'INPUT_TEXT' && (
        <TextInput
          label="Placeholder Text"
          description="Hint text shown inside the empty input field"
          value={field.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="e.g., Enter your name"
          mt="sm"
        />
      )}

      {needsRequired && (
        <Checkbox
          label="Required field"
          description="Applicants must answer this question"
          checked={field.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          mt="sm"
        />
      )}

      {field.type === 'CHECKBOX' && (
        <TextInput
          label="Question Text (optional)"
          description="Add a title/question above the checkbox(es) - leave empty if not needed"
          value={field.questionText || ''}
          onChange={(e) => onUpdate({ questionText: e.target.value })}
          placeholder="e.g., Which programming languages do you know?"
          mt="sm"
        />
      )}

      {field.type === 'CHECKBOX' && field.options && field.options.length > 0 && (
        <Group grow gap="md" mt="sm">
          <NumberInput
            label="Min Choices (optional)"
            description="Minimum selections required"
            value={field.minChoices || ''}
            onChange={(value) => onUpdate({ minChoices: typeof value === 'number' ? value : undefined })}
            placeholder="e.g., 2"
            min={1}
            max={field.options.length}
            error={
              field.minChoices && field.maxChoices && field.minChoices > field.maxChoices
                ? 'Min cannot exceed max'
                : field.minChoices && field.minChoices > field.options.length
                ? `Cannot exceed ${field.options.length} options`
                : undefined
            }
          />
          <NumberInput
            label="Max Choices (optional)"
            description="Maximum selections allowed"
            value={field.maxChoices || ''}
            onChange={(value) => onUpdate({ maxChoices: typeof value === 'number' ? value : undefined })}
            placeholder="e.g., 5"
            min={1}
            max={field.options.length}
            error={
              field.maxChoices && field.maxChoices > field.options.length
                ? `Cannot exceed ${field.options.length} options`
                : undefined
            }
          />
        </Group>
      )}

      {field.type === 'MULTIPLE_CHOICE_OPTION' && field.options && field.options.length > 0 && (
        <Checkbox
          label="Allow selecting multiple options"
          description="Users can select multiple choices (converts radio buttons to checkboxes)"
          checked={field.allowMultiple || false}
          onChange={(e) => onUpdate({ allowMultiple: e.target.checked })}
          mt="sm"
        />
      )}

      {field.type === 'MULTIPLE_CHOICE_OPTION' && field.allowMultiple && field.options && field.options.length > 0 && (
        <Group grow gap="md" mt="sm">
          <NumberInput
            label="Min Choices (optional)"
            description="Minimum selections required"
            value={field.minChoices || ''}
            onChange={(value) => onUpdate({ minChoices: typeof value === 'number' ? value : undefined })}
            placeholder="e.g., 2"
            min={1}
            max={field.options.length}
            error={
              field.minChoices && field.maxChoices && field.minChoices > field.maxChoices
                ? 'Min cannot exceed max'
                : field.minChoices && field.minChoices > field.options.length
                ? `Cannot exceed ${field.options.length} options`
                : undefined
            }
          />
          <NumberInput
            label="Max Choices (optional)"
            description="Maximum selections allowed"
            value={field.maxChoices || ''}
            onChange={(value) => onUpdate({ maxChoices: typeof value === 'number' ? value : undefined })}
            placeholder="e.g., 5"
            min={1}
            max={field.options.length}
            error={
              field.maxChoices && field.maxChoices > field.options.length
                ? `Cannot exceed ${field.options.length} options`
                : undefined
            }
          />
        </Group>
      )}

      {needsOptions && (
        <Stack gap="xs" mt="sm">
          <Group justify="space-between">
            <Text size="sm" fw={500}>Options</Text>
            <Text size="xs" c="dimmed">
              {field.type === 'CHECKBOX'
                ? "Add checkbox options (1 option = single checkbox, 2+ = list)"
                : "Add choices for this question"}
            </Text>
          </Group>

          {(!field.options || field.options.length === 0) && (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No options yet. Click "Add Option" to start.
            </Text>
          )}

          {field.options?.map((option, index) => (
            <Group key={index} gap="xs" wrap="nowrap">
              <TextInput
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                style={{ flex: 1 }}
                required
                error={(field.type === 'CHECKBOX' || field.type === 'MULTIPLE_CHOICE_OPTION') && option.trim() === '' ? 'Option cannot be empty' : undefined}
              />
              <ActionIcon
                variant="subtle"
                onClick={() => moveOption(index, -1)}
                disabled={index === 0}
                aria-label="Move option up"
              >
                <IconArrowUp size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                onClick={() => moveOption(index, 1)}
                disabled={index === field.options!.length - 1}
                aria-label="Move option down"
              >
                <IconArrowDown size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => removeOption(index)}
                disabled={field.options!.length === 1}
                aria-label="Remove option"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}

          <Button
            variant="light"
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={addOption}
          >
            Add Option
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
