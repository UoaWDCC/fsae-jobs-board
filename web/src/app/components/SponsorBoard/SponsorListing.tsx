import { Pagination, Container, Flex, SimpleGrid, rem } from '@mantine/core';
import styles from './SponsorBoard.module.css';
import { FC, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import SponsorBoardCard, { SponsorBoardCardProps } from './SponsorBoardCard';
import { useMediaQuery } from '@mantine/hooks';
import { Sponsor } from '@/models/sponsor.model';
import { fetchSponsors } from '@/api/sponsor';

interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
}
const SponsorListing: FC<JobListingProps> = ({ filterRoles, filterFields }) => {
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const isBase = useMediaQuery('(max-width: 48em)'); // check if screen size is base
  const [isOneColumn, setIsOneColumn] = useState<boolean>(false);
  const [jobListings, setJobListings] = useState<SponsorBoardCardProps[]>([]);

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

  // just checks if SimpleGrid has to be one column or not
  useEffect(() => {
    if (isBase === undefined) setIsOneColumn(false);
    else setIsOneColumn(isBase);
  }, [isBase]);

    useEffect(() => {
      fetchSponsors().then(data => {
        setJobListings(data);
      });
    }, []);


  // chunk all listings into respective count according to screen size for per page display
  // TODO: filter the jobListings before chunking
  const chunkedJobListings = chunk(jobListings, itemsPerPage);

  const currentPageListings = chunkedJobListings[activePage - 1] ?? [];
  const jobListingItems = currentPageListings.map((item, idx) => (
    <div key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <SponsorBoardCard data={item} isOneColumn={isOneColumn} />
    </div>
  ));
  return (
    <Flex justify="flex-start" align="flex-start" direction="column" gap="md" ml="md" mr="md">
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: itemsPerPage > 14 ? 5 : itemsPerPage > 9 ? 4 : 3 }}
        spacing={{ base: rem(20), sm: rem(25), lg: rem(30), xl: rem(40) }}
        verticalSpacing={{ base: rem(15), sm: rem(25), lg: rem(30), xl: rem(40) }}
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
