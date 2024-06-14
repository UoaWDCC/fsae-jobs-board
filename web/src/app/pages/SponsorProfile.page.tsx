import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function SponsorProfile() {
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
          <Button color="customAzureBlue">Log out</Button>
        </NavLink>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Sponsor profile</Title>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <NavLink to="/students">
          <Button variant="filled" color="customPapayaOrange">
            Students Board
          </Button>
        </NavLink>
      </Flex>
    </>
  );
}
