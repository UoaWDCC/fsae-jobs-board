import { Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function AlumniBoard() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Alumni Board</Title>
      </Flex>
    </>
  );
}
