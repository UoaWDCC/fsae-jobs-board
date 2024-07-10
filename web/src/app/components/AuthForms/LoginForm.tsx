import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from '@mantine/core';
import classes from './authform.module.css';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const navigate = useNavigate();
  return (
    <Paper className={classes.loginFormContainer} radius={0} p={30}>
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
          <Anchor<'a'> href="#" fw={700} onClick={(event) => event.preventDefault()}>
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
