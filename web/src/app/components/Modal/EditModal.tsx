import { Modal, Button } from '@mantine/core';
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
      className={styles.modal}
    >
      {content}

      <Button>Cancel</Button>
      <Button>Save</Button>
    </Modal>
  );
}
