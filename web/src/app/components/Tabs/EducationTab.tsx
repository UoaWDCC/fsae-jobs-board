import { Box, TextInput } from "@mantine/core";
import styles from "../Modal/Modal.module.css"

export const EducationTab = () => {
  return (
    <Box>
      <Box className={styles.box}>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput name="university" label="University" size="md"/>
          <TextInput name="majors" label="Majors" size="md"/>
        </Box>
        <Box style={{ flex: 1 }} className={styles.input}>
          <TextInput name="degree" label="Degree" size="md" />
          <TextInput name="graduationYear" label="Graduation Year" size="md"/>
        </Box>
      </Box>
    </Box>
  );
}
