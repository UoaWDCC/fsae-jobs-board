import { Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function SponsorsBoard() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Sponsors Board</Title>
      </Flex>
    </>
  );
}
