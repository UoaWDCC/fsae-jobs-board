import { Flex, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import classes from './JobBoard.module.css';

const JobListing = () => {
  return (
    <Flex
      justify="center"
      align="center"
      gap="md"
      mt="md"
      mr="md"
      className={classes.listingContainer}
    >
      <Title order={3}>FIND JOBS</Title>
      <TextInput placeholder="Search jobs" rightSection={<IconSearch />} />
    </Flex>
  );
};

export default JobListing;
