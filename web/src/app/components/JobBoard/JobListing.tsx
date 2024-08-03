import { Pagination, SimpleGrid, Stack } from '@mantine/core';
import classes from './JobBoard.module.css';
import JobListingItem from './JobListingItem';
import { useState } from 'react';
import { chunk } from 'lodash';

const JobListing = () => {
  const [activePage, setPage] = useState(1);

  // TODO: change this into actual data from backend
  const jobListings = [
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
  ];

  // chunk all listings into four for per page display
  const chunkedJobListings = chunk(jobListings, 4);

  const jobListingItems = chunkedJobListings[activePage - 1].map((jobListingItem) => (
    <JobListingItem
      title={jobListingItem.title}
      company={jobListingItem.company}
      location={jobListingItem.location}
      description={jobListingItem.description}
    />
  ));
  return (
    <Stack className={classes.listingContainer}>
      <SimpleGrid className={classes.listingInnerContainer} cols={2} spacing="xl">
        {jobListingItems}
      </SimpleGrid>
      <div className={classes.paginationContainer}>
        <Pagination
          total={Math.ceil(jobListings.length / 4)}
          value={activePage}
          onChange={setPage}
          classNames={{ root: classes.pagination }}
        />
      </div>
    </Stack>
  );
};

export default JobListing;
