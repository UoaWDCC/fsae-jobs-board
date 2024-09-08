import { FC } from 'react';
import { Flex, Avatar, Box, Text } from '@mantine/core';
import styles from './StudentBoard.module.css';

interface StudentProps {
  name: string;
  role: string;
  degree: string;
  year: string;
  avatar: string;
}

const Student: FC<StudentProps> = ({ name, role, degree, year, avatar }) => (
  <Flex direction="column" align="center" py={10} px={10} className={styles.singleStudent}>
    <Avatar src={avatar} alt={name} className={styles.avatar} />
    <Box mt={10} px={0} className={styles.innerText}>
      <Text size="lg">{name}</Text>
      <Text size="md" className={styles.studentCardRoleText}>
        {role}
      </Text>
      <Text size="sm">
        {degree} {year}
      </Text>
    </Box>
  </Flex>
);

export default Student;
