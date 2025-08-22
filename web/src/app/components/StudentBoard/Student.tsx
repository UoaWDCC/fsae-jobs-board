import { FC } from 'react';
import { Flex, Avatar, Box, Text } from '@mantine/core';
import styles from './StudentBoard.module.css';

interface StudentProps {
  name: string;
  role: string;
  education: string;
  lookingFor: string;
  subGroup: string;
  avatarURL: string;
}

const Student: FC<StudentProps> = ({ name, education, lookingFor, subGroup, avatarURL }) => (
  <Flex direction="column" align="center" py={10} px={10} className={styles.singleStudent}>
    <Avatar src={avatarURL} alt={name} className={styles.avatar} />
    <Box mt={10} px={0} className={styles.innerText}>
      <Text size="lg">{name}</Text>
      <Text size="md" className={styles.studentCardRoleText}>
        {education}
      </Text>
      <Text size="sm">
        {lookingFor}
      </Text>
      <Text size="sm" className={styles.subGroup}>
        {subGroup}
      </Text>
    </Box>
  </Flex>
);

export default Student;
