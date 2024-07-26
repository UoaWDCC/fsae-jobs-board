import { Modal, Button, Box } from '@mantine/core';
import { IconXboxX } from '@tabler/icons-react';
import { ReactNode } from 'react';
import styles from '../../styles/Modal.module.css';

type ModalProp = {
  opened: boolean;
  close: () => void;
  content: ReactNode;
};

export default function EditModal({ opened, close, content }: ModalProp) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      closeButtonProps={{
        icon: <IconXboxX size={20} stroke={1.5} color="#ffffff" />,
      }}
      centered
      size="100%"
      classNames={{
        content: styles.content,
        header: styles.header,
        body: styles.body,
      }}
    >
      {content}

      <Box className={styles.buttonContainer}>
        <Button className={styles.button1}>Cancel</Button>
        <Button className={styles.button2}>Save</Button>
      </Box>
    </Modal>
  );
}
