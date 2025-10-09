import {
  Avatar,
  Button,
  Center,
  Flex,
  Grid,
  Modal,
  Text,
  Title,
} from '@mantine/core';
import {IconXboxX} from '@tabler/icons-react';
import {Role} from '@/app/type/role';
import {AdminReview} from '@/models/adminReview.model';
import styles from '../../styles/AdminReview.module.css';
import { FsaeRole } from '@/models/roles';

interface Props {
  opened: boolean;
  onClose: () => void;
  detail: AdminReview;
  onApprove: (id: string, role: FsaeRole) => void;
  onReject: (id: string, role: FsaeRole) => void;
}

export default function AdminReviewModal({
  opened,
  onClose,
  detail,
  onApprove,
  onReject,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      closeButtonProps={{
        icon: <IconXboxX size={24} stroke={1.8} color="#ffffff" />,
      }}
      classNames={{
        content: styles.content,
        body: styles.body,
        header: styles.header,
      }}
      overlayProps={{backgroundOpacity: 0.55, blur: 2}}
      title={
        <Center className={styles.titleWrapper}>
          <Title order={4} className={styles.title}>
            {detail.name}
          </Title>
        </Center>
      }
    >
      <Flex align="flex-start" gap="xl">
        {/* Avatar Section */}
        <div style={{ flexShrink: 0 }}>
          <Avatar size={120} radius="50%" color="dark">
            {/* placeholder ‒ keep empty for grey circle */}
          </Avatar>
        </div>

        {/* Info Section */}
        <Flex direction="column" gap="md" style={{ flex: 1 }}>
          <Row label="Contact" value={detail.contact} />
          <Row label="Email" value={detail.email} />
          <Row label="User Type" value={detail.role} />
          {detail.intention && <Row label="Intention" value={detail.intention} />}
        </Flex>
      </Flex>

      <Flex justify="flex-end" gap="sm" mt="xl">
        <Button
          color="gray"
          variant="filled"
          onClick={() => onReject(detail.id, detail.role)}
        >
          Reject
        </Button>
        <Button onClick={() => onApprove(detail.id, detail.role)}>Approve</Button>
      </Flex>
    </Modal>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <Flex gap="md" align="flex-start">
      <Text fw={500} w={80} style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text style={{ wordBreak: 'break-word' }}>{value}</Text>
    </Flex>
  );
}