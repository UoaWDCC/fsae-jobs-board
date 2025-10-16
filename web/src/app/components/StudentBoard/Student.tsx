import { FC } from 'react';
import { Avatar, Text } from '@mantine/core';
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
  <div className={styles.singleStudent}>
    <Avatar src={avatarURL} alt={name} className={styles.avatar} />
    <div className={styles.innerText}>
      <Text className={styles.name}>{name}</Text>
      <Text className={styles.studentCardRoleText}>
        {subGroup}
      </Text>
      <Text className={styles.details}>
        {lookingFor}
      </Text>
    </div>
  </div>
);

export default Student;
