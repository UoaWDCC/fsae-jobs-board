import { Flex, Grid, SimpleGrid, Stack, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import classes from './JobBoard.module.css';
import JobListingItem from './JobListingItem';

const JobListing = () => {
  return (
    <Stack className={classes.listingContainer}>
      <Flex justify="center" align="center" gap="md" mt="md" mr="md">
        <Title order={3}>FIND JOBS</Title>
        <TextInput placeholder="Search jobs" rightSection={<IconSearch />} />
      </Flex>
      <SimpleGrid style={{ width: '100%' }} cols={2}>
        <JobListingItem
          title={'Junior Software Developer'}
          company={'WDCC'}
          location={'Auckland CBD, Auckland'}
          description={
            'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.'
          }
        />

        <JobListingItem
          title={'Junior Software Developer'}
          company={'WDCC'}
          location={'Auckland CBD, Auckland'}
          description={
            'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.'
          }
        />
      </SimpleGrid>
    </Stack>
  );
};

export default JobListing;
