import { Box, Flex, Container, Pagination } from '@mantine/core';
import styles from './StudentBoard.module.css';
import { useState, useEffect, FC } from 'react';
import Student from './Student';

interface StudentListingProp {}

const StudentListing: FC<StudentListingProp> = ({}) => {
  const [studentPerPage, setStudentPerPage] = useState<number>(4);
  const [activePage, setActivePage] = useState(1);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const updateItemsPerPage = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    if (window.innerWidth > 1080) {
      setStudentPerPage(6);
    } else {
      setStudentPerPage(4);
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

  const studentList = [
    {
      name: 'John Doe1',
      role: 'Race Engineer',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe2',
      role: ' Business Team Lead',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe3',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe4',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe5',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe6',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
    {
      name: 'John Doe7',
      role: 'Student',
      title: 'Graduate Mechatronics Engineer',
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    },
  ];

  // Calculate the indices for slicing the student list
  const startIndex = (activePage - 1) * studentPerPage;
  const endIndex = startIndex + studentPerPage;

  // Slice the student list to only include the students for the current page
  const paginatedStudents = studentList.slice(startIndex, endIndex);

  return (
    <>
      <Flex gap="md" mt={30} className={styles.studentRow}>
        {paginatedStudents.map((student, index) => (
          <Box key={index} className={styles.studentBox}>
            <Student
              name={student.name}
              role={student.role}
              title={student.title}
              avatar={student.avatar}
            />
          </Box>
        ))}
      </Flex>
      <Container className={styles.paginationContainer}>
        <Pagination
          total={Math.ceil(studentList.length / studentPerPage)}
          value={activePage}
          onChange={setActivePage}
          size="lg"
          mb="md"
        />
      </Container>
    </>
  );
};

export default StudentListing;
