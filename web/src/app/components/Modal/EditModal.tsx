import { Modal, Button, Box } from '@mantine/core';
import { IconXboxX } from '@tabler/icons-react';
import { ReactNode } from 'react';
import styles from '../../componentStyles/Modal.module.css';

type ModalProp = {
  opened: boolean;
  close: () => void;
  content: ReactNode;
};

export default function EditModal({ opened, close, content,title }: ModalProp) {
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
        body: styles.body,
        title: styles.title
      }}
      title={title}
    >
      {content}
    </Modal>
  );
}
