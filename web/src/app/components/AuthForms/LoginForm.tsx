import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Image,
} from '@mantine/core';
import classes from './authform.module.css';
import { NavLink, useNavigate } from 'react-router-dom';

export function LoginForm() {
  const navigate = useNavigate();
  return (
    <Paper className={classes.loginFormContainer} radius={0} p={30}>
      <div className={classes.banner} style={{ alignSelf: 'flex-end' }}>
        <NavLink to="/" className={classes.logo}>
          <Image h={25} src="fsae_white_and_orange_logo.png" fit="contain" />
        </NavLink>
      </div>
      <form className={classes.form}>
        <Title order={5} ta="center" mt="md" mb={50}>
          Login
        </Title>

        <TextInput placeholder="Enter username or email" size="lg" />
        <PasswordInput placeholder="Enter password" mt="md" size="lg" />
        <Checkbox label="Remember Me" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="lg">
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor<'a'> href="#" fw={700} onClick={(event) => navigate('/')}>
            Sign Up
          </Anchor>
        </Text>
        <Text ta="center" mt="md">
          Forget your{' '}
          <Anchor<'a'> href="#" fw={700} onClick={(event) => event.preventDefault()}>
            password?
          </Anchor>
        </Text>
      </form>
    </Paper>
  );
}
