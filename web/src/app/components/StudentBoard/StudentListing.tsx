import { Grid, Flex, Pagination } from '@mantine/core';
import styles from './StudentBoard.module.css';
import { useState, useEffect, FC } from 'react';
import Student from './Student';
import { Link } from 'react-router-dom';

type StudentEntry = {
  id?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  education?: string;
  lookingFor?: string;
  subGroup?: string;
  avatarURL?: string;
};

interface StudentListingProp {
  students: StudentEntry[]; // provided list (state lives here, passed down)
}

const StudentListing: FC<StudentListingProp> = ({ students }) => {
  const [studentPerPage, setStudentPerPage] = useState<number>(16);
  const [activePage, setActivePage] = useState(1);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  // Local copy so we can paginate / mutate locally if needed
  const [studentList, setStudentList] = useState<StudentEntry[]>(students ?? []);

  useEffect(() => {
    setStudentList(students ?? []);
  }, [students]);

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

  // Calculate the indices for slicing the student list
  const startIndex = (activePage - 1) * studentPerPage;
  const endIndex = startIndex + studentPerPage;

  // Slice the student list to only include the students for the current page
  const paginatedStudents = studentList.slice(startIndex, endIndex);

  const defaultAvatar =
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png';

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
            key={student.id ?? index}
            className={styles.studentCard}
          >
            <Link to={"/profile/member/" + student.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Student
                name={student.firstName + " " + student.lastName}
                role={student.role ?? ''}
                education={student.education ?? ''}
                lookingFor={student.lookingFor ?? ''}
                subGroup={student.subGroup ?? ''}
                avatarURL={student.avatarURL ?? defaultAvatar}
              />
            </Link>
          </Grid.Col>
        ))}
      </Grid>
      <Flex align="flex-end" justify="center">
        <Pagination
          total={Math.max(1, Math.ceil(studentList.length / studentPerPage))}
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
