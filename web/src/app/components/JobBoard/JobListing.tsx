import { Flex, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const JobListing = () => {
  return (
    <Flex justify="center" align="center" gap="md" mt="md" mr="md">
      <Title order={3}>FIND JOBS</Title>
      <TextInput placeholder="Search jobs" rightSection={<IconSearch />} />
    </Flex>
  );
};

export default JobListing;
