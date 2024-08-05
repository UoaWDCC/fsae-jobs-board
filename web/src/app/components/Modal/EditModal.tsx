import { Modal, Box, Button } from '@mantine/core';
import { IconXboxX } from '@tabler/icons-react';
import { ReactNode } from 'react';
import styles from './Modal.module.css';

type ModalProp = {
  opened: boolean;
  close: () => void;
  content: ReactNode;
  title: string;
};

export default function EditModal({ opened, close, content, title }: ModalProp) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      closeButtonProps={{
        icon: <IconXboxX size={50} stroke={2} color="#ffffff" />,
      }}
      centered
      size="100%"
      classNames={{
        content: styles.content,
        body: styles.body,
        title: styles.title,
      }}
      title={title}
    >
      {content}
      <Box className={styles.buttonContainer}>
        <Button className={styles.button1} onClick={close}>
          Cancel
        </Button>
        <Button className={styles.button2}>Save</Button>
      </Box>
    </Modal>
  );
}
