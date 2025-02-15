import styles from './authform.module.css';
import { useState, useEffect } from 'react';
import { Flex, Title, PasswordInput, Button, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateResetToken, resetPassword } from '@/api/password';

export function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function validateToken() {
      try {
        const response = await validateResetToken(resetToken) as any;
        console.log(response);
        setEmail(response.data.email);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
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
        <TextInput
          placeholder="Enter Email"
          value={email}
          disabled={true}
          style={{display: "none"}} 
        /> {/* This allows an autofill system to store the new password under the email relevant to this password reset. */}
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
          >Submit</Button>
      </form>
    </Flex>
  );
}
