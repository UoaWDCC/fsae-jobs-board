import { Group, Pagination, Stack, Table, Text } from '@mantine/core';
import styles from './AdminDashboard.module.css';
import { AdminReview } from '@/app/models/adminReview';
import { FC, useState } from 'react';
import { date2string } from '@/app/features/date/dateConverter';
import { ceil } from 'lodash';

interface Props {
  data: AdminReview[];
}
const AdminDashboardTable: FC<Props> = ({ data }) => {
  const [page, onChange] = useState(1);
  const entriesPerPage = 6;

  const totalPages = ceil(data.length / entriesPerPage);

  // Calculate the starting and ending index for the current page
  const startIdx = (page - 1) * entriesPerPage;
  const endIdx = startIdx + entriesPerPage;
  const currentPageData = data.slice(startIdx, endIdx);

  return (
    <Stack justify="center" align="center" gap="md" mt="md">
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
              {currentPageData.map((review) => (
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
        <Pagination.Root
          total={totalPages}
          value={page}
          onChange={onChange}
          className={styles.pagination}
          mt="xl"
        >
          <Group gap={20} justify="center">
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
          </Group>
        </Pagination.Root>
      </div>
    </Stack>
  );
};

export default AdminDashboardTable;
