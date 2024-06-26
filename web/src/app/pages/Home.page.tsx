import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Flex, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

export function HomePage() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Home Page</Title>
      </Flex>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
