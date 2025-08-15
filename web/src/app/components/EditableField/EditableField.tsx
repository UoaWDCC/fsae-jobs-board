import {
  Text,
  TextInput,
  Textarea,
  ActionIcon,
  Group,
  Loader,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import styles from './EditableField.module.css';

interface EditableFieldProps {
  value: string | undefined;
  label?: string;
  placeholder?: string;
  fieldName: string;
  userId: string;
  userRole: 'member' | 'alumni' | 'sponsor';
  type?: 'text' | 'textarea' | 'email' | 'tel';
  onUpdate: (fieldName: string, newValue: string) => void;
  editable?: boolean;
  required?: boolean;
  validation?: (value: string) => string | null;
  maxLength?: number;
  minRows?: number;
  className?: string;
  size?: string;
}

export function EditableField({
  value,
  label,
  placeholder,
  fieldName,
  userId,
  userRole,
  type = 'text',
  onUpdate,
  editable = true,
  required = false,
  validation,
  maxLength,
  minRows = 3,
  className,
  size = 'lg',
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalValue, setOriginalValue] = useState(value || '');

  useEffect(() => {
    const newValue = value || '';
    setEditValue(newValue);
    setOriginalValue(newValue);
  }, [value]);

  // Check if user has made changes
  const hasChanges = editValue.trim() !== originalValue.trim();

  // Real-time validation check
  const getValidationError = (currentValue: string): string | null => {
    if (required && !currentValue.trim()) {
      return `${label || fieldName} is required`;
    }
    if (validation) {
      return validation(currentValue);
    }
    return null;
  };

  const currentError = getValidationError(editValue);
  const isValid = !currentError;

  const handleSave = async () => {
    // Don't save if no changes or invalid
    if (!hasChanges || !isValid) {
      if (currentError) {
        setError(currentError);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const endpoint = getEndpointByRole(userRole);
      const response = await fetch(`http://localhost:3000${endpoint}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [fieldName]: editValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update field');
      }

      // Update local state
      onUpdate(fieldName, editValue);
      setIsEditing(false);
      toast.success(`${label || fieldName} updated successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update field';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(originalValue);
    setIsEditing(false);
    setError(null);
  };

  const handleValueChange = (newValue: string) => {
    setEditValue(newValue);
    // Clear error when user starts typing again
    if (error) {
      setError(null);
    }
  };

  const getEndpointByRole = (role: 'member' | 'alumni' | 'sponsor'): string => {
    switch (role) {
      case 'member':
        return '/user/member';
      case 'alumni':
        return '/user/alumni';
      case 'sponsor':
        return '/user/sponsor';
      default:
        return '/user/member';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && type !== 'textarea') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  if (!editable) {
    return (
      <Text size={size as any} className={className || styles.readOnly}>
        {value || placeholder || 'Not specified'}
      </Text>
    );
  }

  if (isEditing) {
    const buttonGroup = (
      <Group gap={4}>
        <ActionIcon
          onClick={handleSave}
          loading={isLoading}
          variant="filled"
          color={!hasChanges || !isValid ? "gray" : "green"}
          size="xs"
          disabled={isLoading || !hasChanges || !isValid}
          title={!hasChanges ? "No changes to save" : !isValid ? "Please fix errors first" : "Save changes"}
        >
          {isLoading ? <Loader size="xs" /> : <IconCheck size={12} />}
        </ActionIcon>
        <ActionIcon
          onClick={handleCancel}
          variant="light"
          color="red"
          size="xs"
          disabled={isLoading}
          title="Cancel editing"
        >
          <IconX size={12} />
        </ActionIcon>
      </Group>
    );

    return type === 'textarea' ? (
      <Textarea
        value={editValue}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        error={currentError}
        placeholder={placeholder}
        autosize
        minRows={minRows}
        maxLength={maxLength}
        autoFocus
        className={styles.editInput}
        styles={{
          input: currentError && required ? { borderColor: 'var(--mantine-color-red-5)' } : undefined
        }}
        rightSection={buttonGroup}
        rightSectionWidth={60}
      />
    ) : (
      <TextInput
        value={editValue}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        type={type}
        error={currentError}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus
        className={styles.editInput}
        styles={{
          input: currentError && required ? { borderColor: 'var(--mantine-color-red-5)' } : undefined
        }}
        rightSection={buttonGroup}
        rightSectionWidth={60}
      />
    );
  }

  return (
    <Text 
      size={size as any} 
      className={className || styles.value}
      onClick={() => setIsEditing(true)}
    >
      {value || (
        <Text component="span" c="dimmed" fs="italic">
          {placeholder || 'Click to add...'}
        </Text>
      )}
    </Text>
  );
}