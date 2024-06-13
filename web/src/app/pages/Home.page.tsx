import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/signup">
          <Button variant="filled" color="customPapayaOrange">
            Sign up
          </Button>
        </NavLink>
        <NavLink to="/login">
          <Button color="customAzureBlue">Log in</Button>
        </NavLink>
      </Flex>

      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
