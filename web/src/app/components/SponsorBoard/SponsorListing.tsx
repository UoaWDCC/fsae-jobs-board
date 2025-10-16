import { Pagination, Grid } from '@mantine/core';
import styles from './SponsorBoard.module.css';
import { FC, useEffect, useState } from 'react';
import SponsorBoardCard, { SponsorBoardCardProps } from './SponsorBoardCard';
import { Sponsor } from '@/models/sponsor.model';
import { fetchSponsors } from '@/api/sponsor';
import { Link } from 'react-router-dom';

interface JobListingProps {
  filterRoles: string[];
  filterFields: string[];
}
const SponsorListing: FC<JobListingProps> = ({ filterRoles, filterFields }) => {
  const [activePage, setPage] = useState(1);
  const [sponsorsPerPage, setSponsorsPerPage] = useState<number>(16);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [sponsorList, setSponsorList] = useState<SponsorBoardCardProps[]>([]);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1080) {
      setSponsorsPerPage(16);
    } else {
      setSponsorsPerPage(10);
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

  useEffect(() => {
    fetchSponsors().then(data => {
      setSponsorList(data);
    });
  }, []);

  // Calculate the indices for slicing the sponsor list
  const startIndex = (activePage - 1) * sponsorsPerPage;
  const endIndex = startIndex + sponsorsPerPage;

  // Slice the sponsor list to only include the sponsors for the current page
  const paginatedSponsors = sponsorList.slice(startIndex, endIndex);

  return (
    <>
      <Grid
        gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}
        justify="center"
        className={styles.sponsorCardContainer}
      >
        {paginatedSponsors.map((sponsor, index) => (
          <Grid.Col
            span={{ base: 12, sm: 4, md: 3, lg: 2.5 }}
            key={sponsor.id ?? index}
          >
            <Link to={`/profile/sponsor/${sponsor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.sponsorCard}>
                <SponsorBoardCard data={sponsor} />
              </div>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
      <div className={styles.paginationContainer}>
        <Pagination
          total={Math.max(1, Math.ceil(sponsorList.length / sponsorsPerPage))}
          value={activePage}
          onChange={setPage}
          size="lg"
          mb="md"
        />
      </div>
    </>
  );
};

export default SponsorListing;
