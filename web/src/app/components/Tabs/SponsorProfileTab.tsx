import { Box, TextInput } from '@mantine/core';
import styles from '../Modal/Modal.module.css';

export const SponsorProfileTab = () => {
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Company" size="md" />
          <TextInput label="Specialisation" size="md" />
          <TextInput label="Website" size="md" />
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Recruiter" size="md" />
          <TextInput label="Phone" size="md" />
          <TextInput label="Email" size="md" />
        </Box>
      </Box>
    </Box>
  );
};
