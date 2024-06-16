import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function SignUp() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/">
          <Button variant="filled" color="customPapayaOrange">
            Home
          </Button>
        </NavLink>
        <NavLink to="/login">
          <Button color="customAzureBlue">Log in</Button>
        </NavLink>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Sign Up Page</Title>
      </Flex>
    </>
  );
}
