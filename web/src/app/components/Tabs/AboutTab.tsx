import { Box, TextInput, Textarea } from '@mantine/core';
import styles from '../Modal/Modal.module.css';

export const AboutTab = () => {
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="First Name" size="md" />
          <TextInput label="Last Name" size="md" />
          <TextInput label="Email" size="md" />
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Phone Number" size="md" />
          <TextInput label="Subgroup" size="md" />
          <TextInput label="Looking For" size="md" />
        </Box>
      </Box>
      <Textarea
        label="About Me"
        size="md"
        classNames={{
          input: styles.area,
        }}
      />
    </Box>
  );
};
