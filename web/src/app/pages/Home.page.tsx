import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Flex, Title } from '@mantine/core';

export function HomePage() {
  return (
    <>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Home Page</Title>
      </Flex>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
