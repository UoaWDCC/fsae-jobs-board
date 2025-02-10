import styles from './authform.module.css';
import { useState, useEffect } from 'react';
import { Flex, Title, PasswordInput, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateResetToken, resetPassword } from '@/api/password';

export function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function validateToken() {
      try {
        const isValid = await validateResetToken(resetToken);

        if (!isValid) {
          toast.error('Invalid reset token');
          navigate('/forgot-password');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
        navigate('/forgot-password');
      }
    }

    validateToken();
  }, [resetToken]);

  async function onResetPassword() {
    if (!newPassword) {
      toast.error('Please enter your new password');
      return;
    }

    if (!confirmPassword) {
      toast.error('Please confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword(resetToken, newPassword);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }

  return (
    <Flex
      gap="xl"
      justify="center"
      align="center"
      direction="column"
      className={styles.signupFormContainer}
    >
      <Title order={3} ta="center">
        Reset Password
      </Title>

      <form className={styles.form}>
        <PasswordInput
          placeholder="Enter New Password"
          mt="xl"
          size="lg"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          placeholder="Confirm Password"
          mt="xl"
          size="lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button 
          fullWidth 
          mt="xl" 
          mb="md" 
          size="lg" 
          onClick={onResetPassword} 
          >Reset Password</Button>
      </form>
    </Flex>
  );
}
