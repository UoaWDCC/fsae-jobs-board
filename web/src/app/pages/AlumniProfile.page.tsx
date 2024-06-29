import { Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function AlumniProfile() {
  return (
    <>
      <Navbar></Navbar>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Alumni profile</Title>
      </Flex>
    </>
  );
}
