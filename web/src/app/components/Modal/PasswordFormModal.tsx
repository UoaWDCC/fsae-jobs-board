import { Modal, Box, Button, TextInput } from '@mantine/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Modal.module.css';

interface PasswordFormModalProps {
  opened: boolean;
  onClose: () => void;
  onVerify: (password: string) => void; // callback when password is submitted
}

export const PasswordFormModal = ({ opened, onClose, onVerify }: PasswordFormModalProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    onVerify(password); // send the password back to parent
    setPassword('');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Your Password"
      centered
      classNames={{
        content: styles.content,
        body: styles.body,
        title: styles.title,
        header: styles.modalHeader,
      }}
    >
      <Box>
        <TextInput
          label="Enter your password to update your email"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Box className={styles.buttonContainer}>
            <Button className={styles.button1} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Verify</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
