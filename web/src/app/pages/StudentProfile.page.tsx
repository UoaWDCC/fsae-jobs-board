import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function StudentProfile() {
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
        <Title order={1}>Student profile</Title>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <NavLink to="/jobs">
          <Button variant="filled" color="customPapayaOrange">
            Job Board
          </Button>
        </NavLink>
        <NavLink to="/sponsors">
          <Button color="customAzureBlue">Sponsors</Button>
        </NavLink>
      </Flex>
    </>
  );
}
