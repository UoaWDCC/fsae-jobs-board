import { Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function SignUp() {
  return (
    <>
      <Navbar />
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>Sign Up Page</Title>
      </Flex>
    </>
  );
}
