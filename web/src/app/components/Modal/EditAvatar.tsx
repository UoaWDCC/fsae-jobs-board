import { Box, Avatar, Divider, Flex, ActionIcon, Text, FileButton } from '@mantine/core';
import styles from './Modal.module.css';
import { IconCameraPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

interface EditAvatarProps {
  avatar: string;
}

export const EditAvatar = ({ avatar }: EditAvatarProps) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Box>
      <Flex align="center" justify="center" mb={20}>
        <Avatar radius="xl" className={styles.avatar} variant="transparent" src={avatar} />
      </Flex>
      <Divider size="md" />
      <Flex justify="space-between">
        <FileButton onChange={setFile} accept="image/png,image/jpeg">
          {(props) => (
            <button {...props} className={styles.modalButton}>
              <Flex direction="column" align="center">
                <ActionIcon variant="transparent">
                  <IconCameraPlus stroke={2} className={styles.icon} />
                </ActionIcon>
                <Text style={{ cursor: 'pointer' }}>Add Photo</Text>
              </Flex>
            </button>
          )}
        </FileButton>

        <button className={styles.modalButton}>
          <Flex direction="column" align="center">
            <ActionIcon variant="transparent">
              <IconTrash stroke={2} className={styles.icon} />
            </ActionIcon>
            <Text style={{ cursor: 'pointer' }}>Delete</Text>
          </Flex>
        </button>
      </Flex>
    </Box>
  );
};
