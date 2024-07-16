import { Flex, Title } from '@mantine/core';

export function NotFound() {
  return (
    <>
      <Flex justify="center" gap="md" mt="md" mr="md">
        <Title order={1}>This Page Does not Exist</Title>
      </Flex>
    </>
  );
}
