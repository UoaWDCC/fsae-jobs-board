import { Box, TextInput } from "@mantine/core";
import styles from "../Modal/Modal.module.css"

export const EducationTab = () => {
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="University" size="md"/>
          <TextInput label="Majors" size="md"/>
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput label="Degree" size="md" />
          <TextInput label="Graduation Year" size="md"/>
        </Box>
      </Box>
    </Box>
  );
}
