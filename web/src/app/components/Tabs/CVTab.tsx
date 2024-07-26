// import { Dropzone } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { Box, Text, Button, Group } from '@mantine/core';
import { useRef } from 'react';

export const CVTab = () => {
  const openRef = useRef<() => void>(null);
  return (
    <Box style={{ backgroundColor: '#ffffff' }}>
      {/* <Dropzone openRef={openRef}>
        <Box>
          <IconUpload stroke={2} />
          <Text>Drop you file here</Text>
          <Text>or</Text>
        </Box>
      </Dropzone> */}
      <Group justify="center" mt="md">
        <Button onClick={() => openRef.current?.()}>Browse</Button>
      </Group>
    </Box>
  );
}
