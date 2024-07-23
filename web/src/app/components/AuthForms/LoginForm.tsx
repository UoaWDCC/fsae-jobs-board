import { Flex, TextInput, PasswordInput, Checkbox, Button, Title, Text } from '@mantine/core';
import classes from './authform.module.css';
import { NavLink } from 'react-router-dom';

export function LoginForm() {
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
          <NavLink to="/" className={classes.link}>
            Sign up
          </NavLink>
        </Text>
        <Text ta="center" mt="md">
          Forget your{' '}
          <NavLink to="/" className={classes.link}>
            password?
          </NavLink>
        </Text>
      </form>
    </Flex>
  );
}
