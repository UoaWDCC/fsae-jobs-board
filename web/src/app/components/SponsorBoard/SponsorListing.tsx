import { Pagination, Container, Flex, Grid, SimpleGrid } from '@mantine/core';
import styles from './SponsorBoard.module.css';
// import JobListingItem from './JobListingItem';
import { FC, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import SponsorBoardCard, { SponsorBoardCardProps } from './SponsorBoardCard';

interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
}
const SponsorListing: FC<JobListingProps> = ({ filterRoles, filterFields }) => {
  const [activePage, setPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1920) {
      setItemsPerPage(8);
    } else if (window.innerWidth > 1080) {
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
  const jobListings: SponsorBoardCardProps[] = [
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: '/sponsor_placeholder.png',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/128/256',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/500',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/256/256',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/1000/1000',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/422/134',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/200/200',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/433',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      companyTitle: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/250/500',
      sponsorTitle: 'Sponsor Role Title',
      sponsorLink: 'http://localhost:5173/',
    },
  ];

  // chunk all listings into four for per page display
  // TODO: filter the jobListings before chunking
  const chunkedJobListings = chunk(jobListings, itemsPerPage);

  const jobListingItems = chunkedJobListings[activePage - 1].map((jobListingItem) => (
    <div>
      <SponsorBoardCard data={jobListingItem} />
    </div>
  ));
  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md" ml="md" mr="md">
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: itemsPerPage > 6 ? 4 : 3 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        className={styles.jobListingContainer}
      >
        {jobListingItems}
      </SimpleGrid>
      <Container className={styles.paginationContainer}>
        <Pagination
          total={Math.ceil(jobListings.length / itemsPerPage)}
          value={activePage}
          onChange={setPage}
          size="lg"
          mb="md"
          color={'customPapayaOrange.1'}
        />
      </Container>
    </Flex>
  );
};

export default SponsorListing;
