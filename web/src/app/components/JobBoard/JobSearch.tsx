import { Flex, TextInput, Title } from '@mantine/core';
import classes from './JobBoard.module.css';
import { IconSearch } from '@tabler/icons-react';

const JobSearch = () => {
  return (
    <Flex justify="space-between" align="center" gap="md" mt="md" mr="md">
      <div className={classes.spaceContainer}></div>
      <div className={classes.headingContainer}>
        <Title order={4}>FIND JOBS</Title>
        <TextInput placeholder="Search jobs" rightSection={<IconSearch />} />
      </div>
    </Flex>
  );
};

export default JobSearch;
