import { FC } from 'react';
import { Flex, Avatar, Box, Text } from '@mantine/core';
import styles from '../StudentBoard/StudentBoard.module.css';

interface AlumniProps {
  name: string;
  role: string;
  company: string;
  avatarURL: string;
}

const AlumniCard: FC<AlumniProps> = ({ name, role, avatarURL, company }) => (
  <Flex direction="column" align="center" py={10} px={10} className={styles.singleStudent}>
    <Avatar src={avatarURL} alt={name} className={styles.avatar} />
    <Box mt={10} px={0} className={styles.innerText}>
      <Text size="lg">{name}</Text>
      <Text size="md">{company}</Text>
      <Text size="md" className={styles.studentCardRoleText}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
    </Box>
  </Flex>
);

export default AlumniCard;
