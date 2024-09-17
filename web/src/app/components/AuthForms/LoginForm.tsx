import { Flex, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import styles from './authform.module.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from "@/api/login";
import { useState } from "react";

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const handleLoginAs = (userType: 'student' | 'sponsor' | 'alumni' | 'admin') => {
  //
  //
  //    // dispatch(setUserType(userType)); Todo: Move this to API folder
  //   // const profilePath = {
  //   //   student: '/profile/student',
  //   //   sponsor: '/profile/sponsor',
  //   //   alumni: '/profile/alumni',
  //   //   admin: '/profile/admin',
  //   // }[userType];
  //   // toast.success('Logged in as ' + userType);
  //   // navigate(profilePath, { replace: true });
  // };

  async function onLogin() {
    await login(email, password)
      .then((response) => {
        toast.success('Login Successful');
        navigate('/', { replace: true });
        // Todo: Do something afterwards.
        // handleLoginAs(response.data.userType);
      }).catch((error) => {
        console.log(error)
        toast.error(error.toString());
      })
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

        <TextInput placeholder="Enter email" size="lg" mb="lg" value={email} onChange={(event) => setEmail(event.target.value)} />
        <PasswordInput placeholder="Enter password" mt="xl" size="lg" value={password} onChange={(event) => setPassword(event.target.value)} />
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
