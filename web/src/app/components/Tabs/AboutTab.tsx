import { Tabs, Box, TextInput, Textarea } from '@mantine/core';

export const AboutTab = () => {
  return (
    <Box>
      <Box display="flex" style={{ gap: '20px' }}>
        <Box style={{ flex: 1 }}>
          <TextInput label="First Name" />
          <TextInput label="Last Name" />
          <TextInput label="Email" />
        </Box>
        <Box style={{ flex: 1 }}>
          <TextInput label="Phone Number" />
          <TextInput label="Subgroup" />
          <TextInput label="Looking For" />
        </Box>
      </Box>
      <Textarea label="About Me" />
    </Box>
  );
};
