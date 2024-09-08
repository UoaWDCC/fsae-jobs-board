import { Grid, Flex, Pagination } from '@mantine/core';
import styles from './StudentBoard.module.css';
import { useState, useEffect, FC } from 'react';
import Student from './Student';

interface StudentListingProp {}

const StudentListing: FC<StudentListingProp> = ({}) => {
  const [studentPerPage, setStudentPerPage] = useState<number>(16);
  const [activePage, setActivePage] = useState(1);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1080) {
      setStudentPerPage(16);
    } else {
      setStudentPerPage(10);
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

  const baseStudent = {
    name: '',
    role: '',
    degree: '',
    year: '',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
  };

  const studentList = Array.from({ length: 70 }, (_, index) => ({
    ...baseStudent,
    name: index < 10 ? `John Doe${index + 1}` : `Student ${index + 1}`,
    role: index < 10 ? `Race Engineer${index + 1}` : ` Research & development Leader`,
    degree: index < 10 ? ` BEng. Software` : ` BSc. Computer Science`,
    year: index < 10 ? `Year ${index + 1}` : ` Year 2`,
  }));

  // Calculate the indices for slicing the student list
  const startIndex = (activePage - 1) * studentPerPage;
  const endIndex = startIndex + studentPerPage;

  // Slice the student list to only include the students for the current page
  const paginatedStudents = studentList.slice(startIndex, endIndex);

  return (
    <>
      <Grid
        gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}
        justify="center"
        className={styles.studentCardContainer}
      >
        {paginatedStudents.map((student, index) => (
          <Grid.Col
            span={{ base: 12, sm: 4, md: 3, lg: 2.5 }}
            key={index}
            className={styles.studentCard}
          >
            <Student
              name={student.name}
              role={student.role}
              degree={student.degree}
              year={student.year}
              avatar={student.avatar}
            />
          </Grid.Col>
        ))}
      </Grid>
      <Flex align="flex-end" justify="center">
        <Pagination
          total={Math.ceil(studentList.length / studentPerPage)}
          value={activePage}
          onChange={setActivePage}
          size="lg"
          mb="md"
        />
      </Flex>
    </>
  );
};

export default StudentListing;
