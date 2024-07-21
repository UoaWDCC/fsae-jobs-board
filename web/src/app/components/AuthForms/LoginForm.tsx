import {
  Flex,
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
    <Flex
      gap="xl"
      justify="center"
      align="center"
      direction="column"
      className={classes.loginFormContainer}
    >
      <form className={classes.form}>
        <Title order={3} ta="center" mt="md" mb={50}>
          Login
        </Title>

        <TextInput placeholder="Enter email" size="lg" mb="lg" />
        <PasswordInput placeholder="Enter password" mt="xl" size="lg" />
        <Checkbox label="Remember Me" mt="xl" size="md" />
        <Button fullWidth mt="xl" mb="md" size="lg">
          Login
        </Button>

        <Text ta="center" mt="xl">
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
    </Flex>
  );
}
