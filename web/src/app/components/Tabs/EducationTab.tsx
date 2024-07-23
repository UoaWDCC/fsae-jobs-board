import { Box, TextInput } from "@mantine/core";

export const EducationTab = () => {
  return (
    <Box>
      <Box display="flex" style={{ gap: '20px' }}>
        <Box style={{ flex: 1 }}>
          <TextInput label="University" />
          <TextInput label="Majors" />
        </Box>
        <Box style={{ flex: 1 }}>
          <TextInput label="Degree" />
          <TextInput label="Graduation Year" />
        </Box>
      </Box>
    </Box>
  );
}
