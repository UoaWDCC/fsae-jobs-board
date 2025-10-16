import { Grid, Pagination } from '@mantine/core';
import styles from './AlumniBoard.module.css';
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
        className={styles.alumniCardContainer}
      >
        {paginatedAlumni.map((alumni, index) => (
          <Grid.Col
            span={{ base: 12, sm: 4, md: 3, lg: 2.5 }}
            key={index}
          >
           <Link to={`/alumni/${alumni.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.alumniCard}>
                <AlumniCard
                  name={`${alumni.firstName} ${alumni.lastName}`}
                  company={alumni.companyName}
                  role={alumni.role}
                  avatarURL={alumni.avatarURL}
                />
              </div>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
      <div className={styles.paginationContainer}>
        <Pagination
          total={Math.max(1, Math.ceil(alumniList.length / alumniPerPage))}
          value={activePage}
          onChange={setActivePage}
          size="lg"
          mb="md"
        />
      </div>
    </>
  );
};

export default AlumniListing;
