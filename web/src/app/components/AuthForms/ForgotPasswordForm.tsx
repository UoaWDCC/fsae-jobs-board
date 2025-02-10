import { Flex, TextInput, Button, Title, Text } from '@mantine/core';
import styles from './authform.module.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onResetPassword() {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      // await sendPasswordResetEmail(email);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error);
      } else {
        toast.error('An unknown error occurred');
        console.error('Unknown error:', error);
      }
    } finally {
      setLoading(false);
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
          loading={loading}
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
