import React from 'react';
import { Box, Divider, Flex, ActionIcon, Text, Image, FileButton } from '@mantine/core';
import styles from '../../componentStyles/Modal.module.css';
import { IconPencil } from '@tabler/icons-react';
import { IconCameraPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

export const EditBannerModal = ({ banner }) => {
  const [file, setFile] = useState<File | null>(null);
  return (
    <Box>
      <Flex align="center" justify="center" className={styles.bannerWrapper}>
        <Image src={banner} className={styles.banner} />
      </Flex>
      <Divider size="md" />
      <Flex justify="space-between">
        <FileButton onChange={setFile} accept="image/png,image/jpeg">
          {(props) => (
            <button {...props} className={styles.modalButton}>
              <Flex direction="column" align="center">
                <ActionIcon variant="transparent">
                  <IconPencil stroke={2} className={styles.icon} />
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
