import { Pagination, Container, Flex, Grid, SimpleGrid, rem } from '@mantine/core';
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

  const updateItemsPerPage = () => {
    if (window.innerWidth > 1920) {
      setItemsPerPage(15);
    } else if (window.innerWidth > 1080) {
      setItemsPerPage(12);
    } else {
      setItemsPerPage(6);
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
      sponsorTitle: 'Sponsor',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsor_placeholder.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: '3M',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/3m.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Ace Motorsport Karting',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/ace_motorsport_karting.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Altair',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/altair.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Altium',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/altium.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'AMK',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/AMK.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Ansys',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/ansys.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'C-Tech',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/c-tech.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Cadpro',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/cadpro.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Crown',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/crown.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Tengtools',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/tengtools.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'CompanyZone',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/tradezone.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Company Name',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsor_placeholder.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: '3M',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/3m.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Ace Motorsport Karting',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/ace_motorsport_karting.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Altair',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/altair.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Altium',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/altium.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'AMK',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/AMK.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Ansys',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/ansys.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'C-Tech',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/c-tech.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Cadpro',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/cadpro.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Crown',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/crown.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'Tengtools',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/tengtools.png',
      sponsorLink: 'http://localhost:5173/',
    },
    {
      sponsorTitle: 'CompanyZone',
      sponsorIndsutry: 'Industry',
      imageLink: '/sponsors_placeholder/tradezone.png',
      sponsorLink: 'http://localhost:5173/',
    },
  ];

  // chunk all listings into respective count according to screen size for per page display
  // TODO: filter the jobListings before chunking
  const chunkedJobListings = chunk(jobListings, itemsPerPage);

  const jobListingItems = chunkedJobListings[activePage - 1].map((jobListingItem) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <SponsorBoardCard data={jobListingItem} />
    </div>
  ));
  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md" ml="md" mr="md">
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: itemsPerPage > 14 ? 5 : itemsPerPage > 9 ? 4 : 3 }}
        spacing={rem(60)}
        verticalSpacing={rem(40)}
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
          color={'customAzureBlue.1'}
        />
      </Container>
    </Flex>
  );
};

export default SponsorListing;
