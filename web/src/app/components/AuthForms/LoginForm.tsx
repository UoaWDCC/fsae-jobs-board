import { Flex, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import styles from './authform.module.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '@/api/login';
import { useState } from 'react';

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onLogin() {
    try {
      const { userType } = await login(email, password);
      toast.success('Login Successful');

      // Redirect based on user type
      switch (userType) {
        case 'admin':
          navigate('/profile/admin', { replace: true });
          break;
        case 'alumni':
          navigate('/profile/alumni', { replace: true });
          break;
        case 'member':
          navigate('/profile/student', { replace: true });
          break;
        case 'sponsor':
          navigate('/profile/sponsor', { replace: true });
          break;
        default:
          navigate('/'); // Default fallback
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error);
      } else {
        toast.error('An unknown error occurred');
        console.error('Unknown error:', error);
      }
    }
  }

  return (
    <Flex
      gap="xl"
      justify="center"
      align="center"
      direction="column"
      className={styles.loginFormContainer}
    >
      <form className={styles.form}>
        <Title order={3} ta="center" mt="md" mb={50}>
          Login
        </Title>

        <TextInput
          placeholder="Enter email"
          size="lg"
          mb="lg"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordInput
          placeholder="Enter password"
          mt="xl"
          size="lg"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Checkbox label="Remember Me" mt="xl" size="md" />
        <Button fullWidth mt="xl" mb="md" size="lg" onClick={onLogin}>
          Login
        </Button>
        <Text ta="center" mt="xl">
          Don&apos;t have an account?{' '}
          <NavLink to="/" className={styles.link}>
            Sign up
          </NavLink>
        </Text>
        <Text ta="center" mt="md">
          Forget your{' '}
          <NavLink to="/" className={styles.link}>
            password?
          </NavLink>
        </Text>
      </form>
    </Flex>
  );
}
