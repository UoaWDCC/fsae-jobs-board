import { useState } from 'react';
import { Stack, Button, TextInput, Text, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { FieldEditor } from './FieldEditor';
import { CreateFormRequest } from '@/schemas/tally/requests/create-form-request';
import { ZodError } from 'zod';
import { convertToTallyBlocks } from '@/utils/tallyFormUtils';

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;  // Placeholder text for input fields
  options?: string[];  // For CHECKBOX lists or MULTIPLE_CHOICE
  questionText?: string;  // Optional: Separate TITLE block for CHECKBOX lists
  minChoices?: number;  // Minimum selections (CHECKBOX or MULTIPLE_CHOICE with allowMultiple)
  maxChoices?: number;  // Maximum selections (CHECKBOX or MULTIPLE_CHOICE with allowMultiple)
  allowMultiple?: boolean;  // Allow multiple selections for MULTIPLE_CHOICE_OPTION
  groupType: string;  // GROUP_TYPE for Tally blocks
}

interface TallyFormBuilderProps {
  initialFormTitle?: string;
  onSave: (formTitle: string, fields: FormField[]) => void;
  onCancel: () => void;
}

export function TallyFormBuilder({
  initialFormTitle = 'Job Application Form',
  onSave,
  onCancel
}: TallyFormBuilderProps) {
  const [formTitle, setFormTitle] = useState(initialFormTitle);

  // Default fields for job applications (v1 - validated types only)
  const [fields, setFields] = useState<FormField[]>([
    {
      id: '1',
      type: 'INPUT_TEXT',
      label: 'What is your full name?',
      required: true,
      groupType: 'QUESTION'
    },
    {
      id: '2',
      type: 'INPUT_TEXT',
      label: 'What is your email address?',
      required: true,
      groupType: 'QUESTION'
    },
    {
      id: '3',
      type: 'INPUT_TEXT',
      label: 'What is your phone number?',
      required: false,
      groupType: 'QUESTION'
    },
  ]);

  const addField = () => {
    setFields([...fields, {
      id: Date.now().toString(),
      type: 'INPUT_TEXT',
      label: 'New question',
      required: false,
      groupType: 'QUESTION'
    }]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) return;

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= fields.length) return;

    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  };

  /**
   * Validate form configuration using backend Zod schemas
   * Provides immediate feedback in modal before saving
   */
  const validateForm = (): boolean => {
    // Basic validations first
    if (!formTitle.trim()) {
      toast.error('Form title is required');
      return false;
    }

    if (fields.length === 0) {
      toast.error('Please add at least one field to your form');
      return false;
    }

    // Check each field has a label
    for (const field of fields) {
      if (!field.label.trim()) {
        toast.error(`Field "${field.type}" is missing a label/question text`);
        return false;
      }

      // Validate MULTIPLE_CHOICE_OPTION has options
      if (field.type === 'MULTIPLE_CHOICE_OPTION') {
        // Filter empty options before validation
        const cleanOptions = field.options?.filter(opt => opt.trim()) || [];

        if (cleanOptions.length === 0) {
          toast.error(`Multiple choice field "${field.label}" needs at least one option`);
          return false;
        }

        // Update field with cleaned options (removes empty strings)
        field.options = cleanOptions;
      }

      // Validate CHECKBOX has options (UI enforces minimum 1, but filter empty strings)
      if (field.type === 'CHECKBOX') {
        // Filter empty options before validation
        const cleanOptions = field.options?.filter(opt => opt.trim()) || [];

        if (cleanOptions.length === 0) {
          toast.error(`Checkbox field requires at least one non-empty option`);
          return false;
        }

        // Update field with cleaned options (removes empty strings)
        field.options = cleanOptions;

        // Validate min/max choices
        if (field.minChoices !== undefined) {
          if (field.minChoices < 1) {
            toast.error(`Minimum choices must be at least 1`);
            return false;
          }
          if (field.minChoices > cleanOptions.length) {
            toast.error(`Minimum choices (${field.minChoices}) cannot exceed number of options (${cleanOptions.length})`);
            return false;
          }
        }

        if (field.maxChoices !== undefined) {
          if (field.maxChoices < 1) {
            toast.error(`Maximum choices must be at least 1`);
            return false;
          }
          if (field.maxChoices > cleanOptions.length) {
            toast.error(`Maximum choices (${field.maxChoices}) cannot exceed number of options (${cleanOptions.length})`);
            return false;
          }
        }

        if (field.minChoices !== undefined && field.maxChoices !== undefined) {
          if (field.minChoices > field.maxChoices) {
            toast.error(`Minimum choices (${field.minChoices}) cannot exceed maximum choices (${field.maxChoices})`);
            return false;
          }
        }
      }

      // Validate MULTIPLE_CHOICE min/max choices (only when allowMultiple=true)
      if (field.type === 'MULTIPLE_CHOICE_OPTION' && field.allowMultiple) {
        const optionCount = field.options?.length || 0;

        if (field.minChoices !== undefined) {
          if (field.minChoices < 1) {
            toast.error(`Minimum choices must be at least 1 for multiple choice question`);
            return false;
          }
          if (field.minChoices > optionCount) {
            toast.error(`Minimum choices (${field.minChoices}) cannot exceed number of options (${optionCount})`);
            return false;
          }
        }

        if (field.maxChoices !== undefined) {
          if (field.maxChoices < 1) {
            toast.error(`Maximum choices must be at least 1 for multiple choice question`);
            return false;
          }
          if (field.maxChoices > optionCount) {
            toast.error(`Maximum choices (${field.maxChoices}) cannot exceed number of options (${optionCount})`);
            return false;
          }
        }

        if (field.minChoices !== undefined && field.maxChoices !== undefined) {
          if (field.minChoices > field.maxChoices) {
            toast.error(`Minimum choices (${field.minChoices}) cannot exceed maximum choices (${field.maxChoices})`);
            return false;
          }
        }
      }
    }

    // Zod validation: Convert to blocks and validate against backend schema
    try {
      const blocks = convertToTallyBlocks(formTitle, fields);

      CreateFormRequest.parse({
        name: formTitle,
        status: 'PUBLISHED',
        blocks: blocks
      });

      console.log('Form validation passed ✓');
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];
        const errorPath = firstError.path.join('.') || '(root)';
        const errorMessage = `Form structure invalid: ${firstError.message} at ${errorPath}`;

        console.error('Form validation failed:', error.issues);
        toast.error(errorMessage);
        return false;
      }

      toast.error('Form validation failed');
      return false;
    }
  };

  const handleSave = () => {
    // Validate before calling onSave (prevents modal close if invalid)
    if (!validateForm()) {
      return; // Keep modal open - user can fix errors
    }

    onSave(formTitle, fields);
  };

  return (
    <Stack gap="md">
      <Text size="lg" fw={700}>Application Form Configuration</Text>

      <TextInput
        label="Form Title"
        description="This will be shown at the top of your application form"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        required
      />

      <div>
        <Text size="md" fw={600} mb="sm">Form Fields:</Text>
        <Text size="sm" c="dimmed" mb="md">
          Configure the questions applicants will answer. You can reorder fields using the arrow buttons.
        </Text>
        {fields.map((field, index) => (
          <FieldEditor
            key={field.id}
            field={field}
            isFirst={index === 0}
            isLast={index === fields.length - 1}
            onUpdate={(updates) => updateField(field.id, updates)}
            onRemove={() => removeField(field.id)}
            onMoveUp={() => moveField(field.id, 'up')}
            onMoveDown={() => moveField(field.id, 'down')}
          />
        ))}
      </div>

      <Button
        leftSection={<IconPlus size={16} />}
        variant="light"
        onClick={addField}
      >
        Add Field
      </Button>

      <Group mt="xl">
        <Button onClick={handleSave}>Save & Create Form</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </Group>
    </Stack>
  );
}
