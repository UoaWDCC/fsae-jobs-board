import { Box, Stack, Table, Text } from '@mantine/core';
import { Status } from '@/app/type/status';
import { AdminReview } from '@/app/models/adminReview';
import { date2string } from '@/app/features/date/dateConverter';
import styles from './AdminPage.module.css';

const mockReview: AdminReview[] = [
  {
    id: '1',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123456',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234567',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12345678',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '123456',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '1234567',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
  {
    id: '12345678',
    name: 'Google',
    userType: 'sponsor',
    date: new Date(),
    status: Status.Approved,
  },
];

export function AdminDashboard() {
  const rows = mockReview.map((review) => (
    <Table.Tr key={review.id} className={styles.tableRow}>
      <Table.Td className={styles.leftRoundedCell}>{review.name}</Table.Td>
      <Table.Td>{review.userType}</Table.Td>
      <Table.Td>{date2string(review.date)}</Table.Td>
      <Table.Td className={styles.rightRoundedCell}>{review.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'black',
          padding: '1rem',
          width: '100%',
          height: '12vh',
        }}
      ></Box>

      <Stack justify="center" align="center" gap="md" mt="md" mr="md">
        <Text mt={120}>Welcome to the admin dashboard. You have 12 requests pending review</Text>
        <div className={styles.tableContainer}>
          <Table className={styles.table} stickyHeader stickyHeaderOffset={80}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={styles.tableHeader}>Name</Table.Th>
                <Table.Th className={styles.tableHeader}>User Type</Table.Th>
                <Table.Th className={styles.tableHeader}>Date</Table.Th>
                <Table.Th className={styles.tableHeader}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </Stack>
    </>
  );
}
