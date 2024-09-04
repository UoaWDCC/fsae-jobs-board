import { Stack, Table, Text } from '@mantine/core';
import styles from './AdminDashboard.module.css';
import { AdminReview } from '@/app/models/adminReview';
import { FC } from 'react';
import { date2string } from '@/app/features/date/dateConverter';

interface Props {
  data: AdminReview[];
}
const AdminDashboardTable: FC<Props> = ({ data }) => {
  return (
    <Stack justify="center" align="center" gap="md" mt="md" mr="md">
      <Text mt={120}>Welcome to the admin dashboard. You have 12 requests pending review</Text>
      <div className={styles.tableContainer}>
        <Table.ScrollContainer minWidth={500} h={500}>
          <Table className={styles.table} stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={styles.tableHeader}>Name</Table.Th>
                <Table.Th className={styles.tableHeader}>User Type</Table.Th>
                <Table.Th className={styles.tableHeader}>Date</Table.Th>
                <Table.Th className={styles.tableHeader}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((review) => (
                <Table.Tr key={review.id} className={styles.tableRow}>
                  <Table.Td className={styles.leftRoundedCell}>{review.name}</Table.Td>
                  <Table.Td>{review.userType}</Table.Td>
                  <Table.Td>{date2string(review.date)}</Table.Td>
                  <Table.Td className={styles.rightRoundedCell}>{review.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>
    </Stack>
  );
};

export default AdminDashboardTable;
