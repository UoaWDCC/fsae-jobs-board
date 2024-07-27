import React from 'react';
import { Box, Avatar, Divider, Flex, ActionIcon, Text } from '@mantine/core';
import styles from '../../styles/Modal.module.css';
import { IconPencil } from '@tabler/icons-react';
import { IconCameraPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';

export const EditAvatar = () => {
  return (
    <Box>
      <Flex align="center" justify="center">
        <Avatar radius="xl" className={styles.avatar} variant="transparent" />
      </Flex>
      <Divider size="md" />
      <Flex justify="space-between">
        <Flex gap="xl" mt={20}>
          <Flex direction="column" align="center">
            <ActionIcon variant="transparent">
              <IconPencil stroke={2} className={styles.icon} />
            </ActionIcon>
            <Text>Edit</Text>
          </Flex>
          <Flex direction="column" align="center">
            <ActionIcon variant="transparent">
              <IconCameraPlus stroke={2} className={styles.icon} />
            </ActionIcon>
            <Text>Add Photo</Text>
          </Flex>
        </Flex>
        <Flex direction="column" align="center" mt={20}>
          <ActionIcon variant="transparent">
            <IconTrash stroke={2} className={styles.icon} />
          </ActionIcon>
          <Text>Delete</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
