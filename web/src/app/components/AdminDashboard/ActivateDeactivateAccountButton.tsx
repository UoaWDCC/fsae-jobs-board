import { Button, Modal, TextInput, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { adminApi } from '@/api/admin';
import { FsaeRole } from '@/models/roles';

interface ActivateDeactivateAccountButtonProps {
  role?: FsaeRole;
  userId?: string;
  activated?: boolean;
}

export function ActivateDeactivateAccountButton({ role, userId, activated }: ActivateDeactivateAccountButtonProps) {
  // Don't render if required props are undefined
  if (!role || !userId || activated === undefined) {
    return null;
  }

  const [isActivated, setIsActivated] = useState(activated);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    setLoading(true);
    try {
      await adminApi.activateAccount(userId, role);
      setIsActivated(true);
    } catch (error) {
      console.error('Error activating account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!reason.trim()) return;
    
    setLoading(true);
    try {
      await adminApi.deactivateAccount(userId, role, reason);
      setIsActivated(false);
      setDeactivateModalOpen(false);
      setReason('');
    } catch (error) {
      console.error('Error deactivating account:', error);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = isActivated ? 'Deactivate Account' : 'Re-activate Account';
  const buttonAction = isActivated 
    ? () => setDeactivateModalOpen(true)
    : handleActivate;

  return (
    <>
      <Button
        onClick={buttonAction}
        loading={loading}
        color="red"
        radius="xl"
        size="sm"
        styles={{
          root: {
            backgroundColor: '#e64040ff',
            color: 'white',
            border: 'none',
            display: 'inline-block',
            width: 'auto',
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: '#e64040ff',
            }
          }
        }}
      >
        {buttonText}
      </Button>

      <Modal
        opened={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title="Deactivate Account"
        centered
      >
        <Text mb="md">Please provide a reason for deactivating this account:</Text>
        <TextInput
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          mb="md"
          required
        />
        <Group justify="flex-end">
          <Button
            variant="subtle"
            onClick={() => setDeactivateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeactivate}
            disabled={!reason.trim()}
            loading={loading}
          >
            Deactivate Account
          </Button>
        </Group>
      </Modal>
    </>
  );
}
