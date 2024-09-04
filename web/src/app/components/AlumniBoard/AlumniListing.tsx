import { Grid, Flex, Pagination } from '@mantine/core';
import styles from '../StudentBoard/StudentBoard.module.css';
import { useState, useEffect, FC } from 'react';
import Alumni from './Alumni'

interface AlumniListingProp {}

const AlumniListing: FC<AlumniListingProp> = ({}) => {
  const [alumniPerPage, setAlumniPerPage] = useState<number>(16);
  const [activePage, setActivePage] = useState(1);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

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

  const baseAlumni = {
    name: '',
    role: '',
    company: '',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
  };

  const alumniList = Array.from({ length: 70 }, (_, index) => ({
    ...baseAlumni,
    name: index < 10 ? `John Doe${index + 1}` : `Student ${index + 1}`,
    role: index < 10 ? `Race Engineer${index + 1}` : ` Research & development Leader`,
    company: index < 10 ? `Datacom` : ` Xero`,
  }));

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
            <Alumni
              name={alumni.name}
              company={alumni.company}
              role={alumni.role}
              avatar={alumni.avatar}
            />
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
