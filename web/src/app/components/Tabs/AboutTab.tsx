import { Tabs, Box, TextInput, Textarea } from '@mantine/core';
import styles from "../../styles/Modal.module.css"

export const AboutTab = () => {
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="First Name" />
          <TextInput label="Last Name" />
          <TextInput label="Email" />
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Phone Number" />
          <TextInput label="Subgroup" />
          <TextInput label="Looking For" />
        </Box>
      </Box>
      <Textarea
        label="About Me"
        classNames={{
          input: styles.area,
        }}
      />
    </Box>
  );
};
