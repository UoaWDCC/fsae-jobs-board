import { Box, TextInput, Textarea } from '@mantine/core';
import styles from '../Modal/Modal.module.css';

export const SponsorAboutTab = () => {
  return (
    <Box>
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
