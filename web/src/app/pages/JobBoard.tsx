import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function JobBoard() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/">
          <Button variant="filled" color="customPapayaOrange">
            Profile
          </Button>
        </NavLink>
        <NavLink to="/login">
          <Button color="customAzureBlue">Sponsors</Button>
        </NavLink>
      </Flex>
      <ColorSchemeToggle />
    </>
  );
}
