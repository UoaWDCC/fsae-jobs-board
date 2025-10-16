import { FC } from 'react';
import { Avatar, Text } from '@mantine/core';
import styles from './AlumniBoard.module.css';

interface AlumniProps {
  name: string;
  role: string;
  company: string;
  avatarURL: string;
}

const AlumniCard: FC<AlumniProps> = ({ name, role, avatarURL, company }) => (
  <div className={styles.singleAlumni}>
    <Avatar src={avatarURL} alt={name} className={styles.avatar} />
    <div className={styles.alumniTextContainer}>
      <Text className={styles.alumniName}>{name}</Text>
      <Text className={styles.alumniCompany}>{company}</Text>
      <Text className={styles.alumniRole}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
    </div>
  </div>
);

export default AlumniCard;
