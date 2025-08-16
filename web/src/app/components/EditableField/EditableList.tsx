import {
  Text,
  TextInput,
  ActionIcon,
  Group,
  Box,
  Badge,
  Button,
  Stack,
} from '@mantine/core';
import { useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import styles from './EditableField.module.css';

interface EditableListProps {
  items: string[];
  fieldName: string;
  userId: string;
  userRole: 'member' | 'alumni' | 'sponsor';
  onUpdate: (fieldName: string, newItems: string[]) => void;
  editable?: boolean;
  placeholder?: string;
  maxItems?: number;
  showMoreThreshold?: number;
}

export function EditableList({
  items,
  fieldName,
  userId,
  userRole,
  onUpdate,
  editable = true,
  placeholder = 'Add item...',
  maxItems = 20,
  showMoreThreshold = 4,
}: EditableListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<string[]>([...items]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const displayItems = showMore ? items : items.slice(0, showMoreThreshold);

  const handleSave = async () => {
    setIsLoading(true);
    
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
          [fieldName]: editItems.filter(item => item.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update list');
      }

      onUpdate(fieldName, editItems.filter(item => item.trim()));
      setIsEditing(false);
      toast.success(`${fieldName} updated successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update list';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditItems([...items]);
    setNewItem('');
    setIsEditing(false);
  };

  const handleAddItem = () => {
    if (newItem.trim() && editItems.length < maxItems) {
      setEditItems([...editItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    const updated = [...editItems];
    updated[index] = value;
    setEditItems(updated);
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

  if (!editable) {
    return (
      <Box>
        {items.length > 0 ? (
          <>
            {displayItems.map((item, index) => (
              <Text size="md" key={index} mb="xs">
                {item}
              </Text>
            ))}
            {items.length > showMoreThreshold && (
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setShowMore(!showMore)}
                p={0}
              >
                {showMore ? 'Show less' : `Show ${items.length - showMoreThreshold} more`}
              </Button>
            )}
          </>
        ) : (
          <Text c="dimmed" fs="italic">
            No items added
          </Text>
        )}
      </Box>
    );
  }

  if (isEditing) {
    return (
      <Box className={styles.editingContainer}>
        <Stack gap="xs">
          {editItems.map((item, index) => (
            <Group key={index} gap="xs">
              <TextInput
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder="Enter item..."
                style={{ flex: 1 }}
              />
              <ActionIcon
                onClick={() => handleRemoveItem(index)}
                variant="light"
                color="red"
                size="sm"
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          ))}
          
          {editItems.length < maxItems && (
            <Group gap="xs">
              <TextInput
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
                style={{ flex: 1 }}
              />
              <ActionIcon
                onClick={handleAddItem}
                variant="light"
                color="blue"
                size="sm"
                disabled={!newItem.trim()}
              >
                <IconPlus size={14} />
              </ActionIcon>
            </Group>
          )}
        </Stack>

        <Group gap="xs" mt="md">
          <Button
            onClick={handleSave}
            loading={isLoading}
            size="sm"
            variant="filled"
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            size="sm"
            variant="light"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Group>
      </Box>
    );
  }

  return (
    <Box 
      onClick={() => setIsEditing(true)}
      className={styles.value}
      mb="sm"
    >
      {items.length > 0 ? (
        <>
          {displayItems.map((item, index) => (
            <Badge key={index} variant="light" mr="xs" mb="xs">
              {item}
            </Badge>
          ))}
          {items.length > showMoreThreshold && (
            <Button
              variant="subtle"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowMore(!showMore);
              }}
              p={0}
              mb="xs"
            >
              {showMore ? 'Show less' : `+${items.length - showMoreThreshold} more`}
            </Button>
          )}
        </>
      ) : (
        <Text c="dimmed" fs="italic">
          Click to add items...
        </Text>
      )}
    </Box>
  );
}