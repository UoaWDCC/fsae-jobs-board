import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

export function SponsorProfile() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Sponsor profile</Title>
      </Flex>
    </>
  );
}
