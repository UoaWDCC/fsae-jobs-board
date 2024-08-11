import { Pagination, Container, Flex } from '@mantine/core';
import styles from './JobBoard.module.css';
import JobListingItem from './JobListingItem';
import { FC, useEffect, useState } from 'react';
import { chunk } from 'lodash';

interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
}
const JobListing: FC<JobListingProps> = ({ filterRoles, filterFields }) => {
  const [activePage, setPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1080) {
      setItemsPerPage(6);
    } else {
      setItemsPerPage(4);
    }
  };

  useEffect(() => {
    updateItemsPerPage(); // Set initial value
    window.addEventListener('resize', updateItemsPerPage);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  // TODO: change this into actual data from backend, and apply filters & search
  const jobListings = [
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      logo: 'WDCCLogo.png',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      logo: 'WDCCLogo.png',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      logo: 'WDCCLogo.png',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      logo: 'WDCCLogo.png',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
    {
      title: 'Junior Software Developer',
      company: 'WDCC',
      logo: 'WDCCLogo.png',
      location: 'Auckland CBD, Auckland',
      description:
        'In this role, you will work to design, develop, and maintain software solutions using .NET, Typescript, and JavaScript.',
    },
  ];

  // chunk all listings into four for per page display
  // TODO: filter the jobListings before chunking
  const chunkedJobListings = chunk(jobListings, itemsPerPage);

  const jobListingItems = chunkedJobListings[activePage - 1].map((jobListingItem) => (
    <JobListingItem
      title={jobListingItem.title}
      company={jobListingItem.company}
      location={jobListingItem.location}
      description={jobListingItem.description}
      logo={jobListingItem.logo}
    />
  ));
  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md" wrap="wrap" w="100%">
      <Container className={styles.listingInnerContainer}>{jobListingItems}</Container>
      <Container className={styles.paginationContainer}>
        <Pagination
          total={Math.ceil(jobListings.length / itemsPerPage)}
          value={activePage}
          onChange={setPage}
          size="lg"
          mb="md"
        />
      </Container>
    </Flex>
  );
};

export default JobListing;
