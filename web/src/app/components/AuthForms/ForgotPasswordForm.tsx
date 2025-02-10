import { Flex, TextInput, Button, Title, Text } from '@mantine/core';
import styles from './authform.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '@/api/password';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');

  async function onResetPassword() {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
  
    try {
      await requestPasswordReset(email);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      navigate('/login');
    }
  }

  return (
    <Flex
      gap="xl"
      justify="center"
      align="center"
      direction="column"
      className={styles.forgotPasswordFormContainer}
    >
      <form className={styles.form}>
        <Title order={3} ta="center" mt="md" mb={50}>
          Forgot Password
        </Title>

        <TextInput
          placeholder="Enter your email"
          size="lg"
          mb="lg"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Button 
          fullWidth 
          mt="xl" 
          mb="md" 
          size="lg" 
          onClick={onResetPassword} 
        >
          Send Reset Link
        </Button>

        <Text ta="center" mt="xl">
          Remember your password?{' '}
          <NavLink to="/login" className={styles.link}>
            Login
          </NavLink>
        </Text>
      </form>
    </Flex>
  );
}
