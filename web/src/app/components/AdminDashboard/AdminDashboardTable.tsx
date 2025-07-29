import {useState, useEffect, FC} from 'react';
import {Group, Pagination, Stack, Table, Text} from '@mantine/core';
import {AdminReview} from '@/models/adminReview.model';
import {date2string} from '@/app/features/date/dateConverter';
import styles from './AdminDashboard.module.css';

interface Props {
  data: AdminReview[];
  onSelect?: (review: AdminReview) => void;
}

const AdminDashboardTable: FC<Props> = ({data, onSelect}) => {
  const [page, setPage] = useState(1);
  const entriesPerPage = 6;

  /* if data shrinks (e.g. after filtering) keep page in range */
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(data.length / entriesPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [data, page]);

  const totalPages = Math.max(1, Math.ceil(data.length / entriesPerPage));
  const startIdx   = (page - 1) * entriesPerPage;
  const pageData   = data.slice(startIdx, startIdx + entriesPerPage);

  return (
    <Stack justify="center" align="center" gap="md" mt="md">
      <div className={styles.tableContainer}>
        <Table.ScrollContainer minWidth={500} h={500}>
          <Table stickyHeader stickyHeaderOffset={0} className={styles.table}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={styles.tableHeader}>Name</Table.Th>
                <Table.Th className={styles.tableHeader}>User Type</Table.Th>
                <Table.Th className={styles.tableHeader}>Date</Table.Th>
                <Table.Th className={styles.tableHeader}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {pageData.map(review => (
                <Table.Tr
                  key={review.id}
                  className={styles.tableRow}
                  style={{cursor: onSelect ? 'pointer' : 'default'}}
                  onClick={() => onSelect?.(review)}
                >
                  <Table.Td className={styles.leftRoundedCell}>
                    {review.name}
                  </Table.Td>

                  <Table.Td>
                    {review.role.charAt(0).toUpperCase() + review.role.slice(1)}
                  </Table.Td>

                  <Table.Td>{date2string(review.date)}</Table.Td>

                  <Table.Td className={styles.rightRoundedCell}>
                    {review.status.charAt(0).toUpperCase() +
                      review.status.slice(1)}
                  </Table.Td>
                </Table.Tr>
              ))}

              {pageData.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed">
                      No requests match your filters
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Pagination.Root
          total={totalPages}
          value={page}
          onChange={setPage}
          className={styles.pagination}
          mt="xl"
        >
          <Group gap={20} justify="center">
            <Pagination.First aria-label="First page" />
            <Pagination.Previous aria-label="Previous page" />
            <Pagination.Items />
            <Pagination.Next aria-label="Next page" />
            <Pagination.Last aria-label="Last page" />
          </Group>
        </Pagination.Root>
      </div>
    </Stack>
  );
};

export default AdminDashboardTable;
