import { Box, TextInput } from "@mantine/core";
import styles from "../Modal/Modal.module.css"

export const EducationTab = () => {
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="University" />
          <TextInput label="Majors" />
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Degree" />
          <TextInput label="Graduation Year" />
        </Box>
      </Box>
    </Box>
  );
}
