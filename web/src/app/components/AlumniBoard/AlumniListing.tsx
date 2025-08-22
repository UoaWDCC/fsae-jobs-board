import { Grid, Flex, Pagination } from '@mantine/core';
import styles from '../StudentBoard/StudentBoard.module.css';
import { useState, useEffect, FC } from 'react';
import AlumniCard from './Alumni'
import { fetchAlumni } from '@/api/alumni';
import { Alumni } from '@/models/alumni.model';
import { Link } from 'react-router-dom';

interface AlumniListingProp {}

const AlumniListing: FC<AlumniListingProp> = ({}) => {
  const [alumniPerPage, setAlumniPerPage] = useState<number>(16);
  const [activePage, setActivePage] = useState(1);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1080) {
      setAlumniPerPage(16);
    } else {
      setAlumniPerPage(10);
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
    fetchAlumni().then(data => {
      console.log('Fetched alumni data:', data);
      setAlumniList(data);
    });
  }, []);

  // Calculate the indices for slicing the student list
  const startIndex = (activePage - 1) * alumniPerPage;
  const endIndex = startIndex + alumniPerPage;

  // Slice the student list to only include the students for the current page
  const paginatedAlumni = alumniList.slice(startIndex, endIndex);

  return (
    <>
      <Grid
        gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}
        justify="center"
        className={styles.studentCardContainer}
      >
        {paginatedAlumni.map((alumni, index) => (
          <Grid.Col
            span={{ base: 12, sm: 4, md: 3, lg: 2.5 }}
            key={index}
            className={styles.studentCard}
          >
           <Link to={`/alumni/${alumni.id}`} style={{ textDecoration: 'none' }}>
              <AlumniCard
                name={`${alumni.firstName} ${alumni.lastName}`}
                company={alumni.companyName}
                role={alumni.role}
                avatarURL={alumni.avatarURL}
              />
            </Link>
          </Grid.Col>
        ))}
      </Grid>
      <Flex align="flex-end" justify="center">
        {!isPortrait ? (
          <Pagination
            total={Math.ceil(alumniList.length / alumniPerPage)}
            value={activePage}
            onChange={setActivePage}
            size="lg"
            mb="md"
          />
        ) : (
          <Pagination
            total={Math.ceil(alumniList.length / alumniPerPage)}
            boundaries={1}
            siblings={0}
            value={activePage}
            onChange={setActivePage}
            size="lg"
            mb="md"
          />
        )}
      </Flex>
    </>
  );
};

export default AlumniListing;
