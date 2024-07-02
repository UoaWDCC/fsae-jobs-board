import { Button, Flex, Title } from '@mantine/core';
import Navbar from '../components/Navbar/Navbar';

export function NotFound() {
  return (
    <>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>This Page Does not Exist</Title>
      </Flex>
    </>
  );
}
