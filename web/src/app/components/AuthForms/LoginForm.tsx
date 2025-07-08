import { Flex, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import styles from './authform.module.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '@/api/login';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setRole, setId } from '@/app/features/user/userSlice';

export function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  // Check if user is redirected from verify page, if so, auto-fill email and password that were entered from login or signup.
  useEffect(() => {
    try {
      if (email && password) {
        return;
      } else if (location.state.email && location.state.password) {
        setEmail(location.state.email);
        setPassword(location.state.password);
      }
    } catch (error) {
      // Expected error if user is not redirected from verify page
    }
  }, [location.state, email, password]);  

  async function onLogin() {
    try {
      const { role, id } = await login(email, password);
      console.log(role);
      dispatch(setRole(role));
      dispatch(setId(id));
      toast.success('Login Successful');

      // Redirect based on role
      switch (role) {
        case 'unverified':
          navigate('/verify', {state: { email: email, password: password}, replace: true});
          break;
        case 'admin':
          navigate(`/profile/admin/${id}`, { replace: true });
          break;
        case 'alumni':
          navigate(`/profile/alumni/${id}`, { replace: true });
          break;
        case 'member':
          navigate(`/profile/member/${id}`, { replace: true });
          break;
        case 'sponsor':
          navigate(`/profile/sponsor/${id}`, { replace: true });
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
          <NavLink to="/forgot-password" className={styles.link}>
            password?
          </NavLink>
        </Text>
      </form>
    </Flex>
  );
}
