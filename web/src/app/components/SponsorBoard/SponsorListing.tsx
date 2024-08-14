import { Pagination, Container, Flex } from '@mantine/core';
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
  const testSponsorBoardCardProps: SponsorBoardCardProps = {
    title: 'Company Name',
    subtitle: 'industry',
    imageLink: 'https://picsum.photos/500/500',
    roleTitle: 'Sponsor Role Title',
    roleLink: 'http://localhost:5173/',
  };

  const jobListings: SponsorBoardCardProps[] = [
    {
      title: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/500',
      roleTitle: 'Sponsor Role Title',
      roleLink: 'http://localhost:5173/',
    },
    {
      title: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/500',
      roleTitle: 'Sponsor Role Title',
      roleLink: 'http://localhost:5173/',
    },
    {
      title: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/500',
      roleTitle: 'Sponsor Role Title',
      roleLink: 'http://localhost:5173/',
    },
    {
      title: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/500',
      roleTitle: 'Sponsor Role Title',
      roleLink: 'http://localhost:5173/',
    },
    {
      title: 'Company Name',
      subtitle: 'Industry',
      imageLink: 'https://picsum.photos/500/500',
      roleTitle: 'Sponsor Role Title',
      roleLink: 'http://localhost:5173/',
    },
  ];

  // chunk all listings into four for per page display
  // TODO: filter the jobListings before chunking
  const chunkedJobListings = chunk(jobListings, itemsPerPage);

  const jobListingItems = chunkedJobListings[activePage - 1].map((jobListingItem) => (
    // <SponsorBoardCard data={jobListingItem} />
    <SponsorBoardCard data={jobListingItem} />
  ));
  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md">
      <Container className={styles.listingInnerContainer} fluid>
        {jobListingItems}
      </Container>
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
