import { Modal, Stack, TextInput, Checkbox, NumberInput, Group, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Toast } from 'react-toastify/dist/components';
import { API_BASE_URL } from '@/api/ApiInstance';

interface InviteCode {
  id: string;
  code: string;
  isActive: boolean;
  useCount: number;
  maxUses: number;
  createdAt: Date;
}

interface InviteCodeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function InviteCodeModal({ opened, onClose }: InviteCodeModalProps) {
  const [formData, setFormData] = useState<InviteCode>({
    id: '',
    code: '',
    isActive: false,
    useCount: 0,
    maxUses: 1,
    createdAt: new Date(),
  });

  const handleChange = (field: keyof InviteCode, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/admin/invite-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create invite code');
      }

      const newInviteCode = await response.json();
      onClose();
      toast.success('Successfully created invite code!');
    } catch (error) {
      console.error('Error creating invite code:', error);
      toast.error('Error creating invite code');
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="New Invite Code">
      <Stack>
        <TextInput
          label="Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.currentTarget.value)}
          placeholder='Leave blank to generate random code'
        />
        <Checkbox
          label="Active"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.currentTarget.checked)}
        />
        <NumberInput
          label="Max Uses"
          value={formData.maxUses}
          onChange={(value) => handleChange('maxUses', value || 1)}
          min={1}
          step={1}
          hideControls={false}
        />
        <TextInput
          label="Created At"
          value={formData.createdAt.toISOString().slice(0, 10)}
          disabled
        />
        <Group justify="flex-end">
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
