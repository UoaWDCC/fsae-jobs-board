import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function Login() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/signup">
          <Button variant="filled" color="customPapayaOrange">
            Sign up
          </Button>
        </NavLink>
        <NavLink to="/home">
          <Button color="customAzureBlue">Home</Button>
        </NavLink>
      </Flex>
    </>
  );
}
