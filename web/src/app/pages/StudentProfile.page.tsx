import { Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function StudentProfile() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Student profile</Title>
      </Flex>
    </>
  );
}
