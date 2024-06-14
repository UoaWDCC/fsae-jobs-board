import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function JobBoard() {
  return (
    <>
      {/* Temporary buttons for route testing */}
      <Flex justify="right" gap="md" mt="md" mr="md">
        <NavLink to="/profile/student">
          <Button variant="filled" color="customPapayaOrange">
            Profile
          </Button>
        </NavLink>
        <NavLink to="/sponsors">
          <Button color="customAzureBlue">Sponsors</Button>
        </NavLink>
      </Flex>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Job Board</Title>
      </Flex>
    </>
  );
}
