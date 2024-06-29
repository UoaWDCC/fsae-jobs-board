import { Button, Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function StudentsBoard() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Students Board</Title>
      </Flex>
    </>
  );
}
