import { FC } from 'react';
import { Flex, Avatar, Box, Text } from '@mantine/core';
import classes from './StudentBoard.module.css'; 

interface StudentProps {
  name: string;
  role: string;
  title: string;
  avatar: string;
}

const Student: FC<StudentProps> = ({ name, role, title, avatar }) => (
  <Flex direction="column" align="center" py={10} px={10} className={classes.singleStudent}>
    <Avatar src={avatar} alt={name} className={classes.avatar} />
    <Box mt={10} px={0} className={classes.innerText}>
      <Text size="lg">{name}</Text>
      <Text size="sm" fs="italic">
        {role}
      </Text>
      <Text size="sm" mt={10} className={classes.studentTitle}>
        {title}
      </Text>
    </Box>
  </Flex>
);

export default Student;
