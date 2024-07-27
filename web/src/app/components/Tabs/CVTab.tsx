import { Dropzone } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { Box, Text, Button, Group, Flex } from '@mantine/core';
import { useRef } from 'react';
import styles from "../../styles/Modal.module.css"

export const CVTab = () => {
  const openRef = useRef<() => void>(null);
  return (
    <Box className={styles.dropContainer}>
      <Flex direction="column" align="center" justify="center" className={styles.dropWrapper}>
        <Dropzone openRef={openRef} classNames={{ root: styles.dropRoot }}>
          <Flex justify="center" align="center" direction="column">
            <IconUpload stroke={2} className={styles.dropIcon} />
            <Text>Drop you file here</Text>
            <Text>or</Text>
            <Group justify="center" mt="md">
              <Button onClick={() => openRef.current?.()} className={styles.dropButton}>
                Browse
              </Button>
            </Group>
          </Flex>
        </Dropzone>

        {/* Mobile version with just upload button shown up */}
        <Group justify="center" mt="md" className={styles.mobileDrop}>
          <Button
            leftSection={<IconUpload size={14} />}
            variant="default"
            onClick={() => openRef.current?.()}
            className={styles.mobileButton}
          >
            Upload CV
          </Button>
          
        </Group>
      </Flex>
    </Box>
  );
}
