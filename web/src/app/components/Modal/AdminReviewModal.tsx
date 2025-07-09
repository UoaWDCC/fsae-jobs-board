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
import {AdminReview} from '@/models/adminReview.model';
import styles from './Modal.module.css';
import { Role } from '@/app/type/role';

interface Props {
  opened: boolean;
  onClose: () => void;
  detail: AdminReview;
  onApprove: (id: string, role: Role) => void;
  onReject:  (id: string, role: Role) => void;
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
      size="100%"
      closeButtonProps={{
        icon: <IconXboxX size={50} stroke={2} color="#ffffff" />,
      }}
      classNames={{
        content: styles.content,
        body: styles.body,
        title: styles.title,
        header: styles.modalHeader,
      }}
      title={
        <Center>
          <Title order={4}>{detail.name}</Title>
        </Center>
      }
      overlayProps={{backgroundOpacity: 0.55, blur: 2}}
    >
      <Grid>
        <Grid.Col span={4}>
          <Center>
            <Avatar size={180} radius="xl" />
          </Center>
        </Grid.Col>

        <Grid.Col span={8}>
          <Flex direction="column" gap="sm">
            <Row label="Contact"   value={detail.contact} />
            <Row label="Email"     value={detail.email} />
            <Row label="User Type" value={detail.role} />
            {detail.intention && <Row label="Intention" value={detail.intention} />}
          </Flex>
        </Grid.Col>
      </Grid>

      <Flex mt="lg" justify="flex-end" gap="sm">
        <Button variant="filled" color="gray" onClick={() => onReject(detail.id, detail.role)}>
          Reject
        </Button>
        <Button onClick={() => onApprove(detail.id, detail.role)}>Approve</Button>
      </Flex>
    </Modal>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <Flex gap="md">
      <Text fw={500} w={90}>
        {label}
      </Text>
      <Text>{value}</Text>
    </Flex>
  );
}
