import { Stack, Table, Text } from '@mantine/core';
import 'mantine-datatable/styles.css';
import styles from './AdminDashboard.module.css';
import { AdminReview } from '@/app/models/adminReview';
import { FC, useEffect, useState } from 'react';
import { date2string } from '@/app/features/date/dateConverter';
import { DataTable } from 'mantine-datatable';

const PAGE_SIZE = 8;

interface Props {
  data: AdminReview[];
}

const AdminDashboardTable: FC<Props> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(data.slice(0, PAGE_SIZE));

  const columns = [
    {
      accessor: 'name',
      cellsClassName: styles.leftRoundedCell,
      width: 60,
    },
    {
      accessor: 'userType',
      cellsClassName: styles.tableRow,
      textAlign: 'center',
      width: 40,
    },
    {
      accessor: 'date',
      render: ({ date }) => date2string(date),
      cellsClassName: styles.tableRow,
      textAlign: 'center',
      width: 40,
    },
    {
      accessor: 'status',
      cellsClassName: styles.rightRoundedCell,
      textAlign: 'center',
      width: 30,
    },
  ];

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(data.slice(from, to));
  }, [page]);

  return (
    <Stack justify="center" align="center" gap="md" mt="md">
      <div className={styles.tableContainer}>
        {/* <Table.ScrollContainer minWidth={500} h={500}>
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
        </Table.ScrollContainer> */}
        {data && (
          <DataTable
            records={records}
            columns={columns}
            backgroundColor="transparent"
            rowBorderColor="black"
            verticalSpacing="md"
            classNames={{ header: styles.tableHeader, pagination: styles.pagination }}
            rowClassName={styles.tableRow}
            totalRecords={data.length}
            recordsPerPage={PAGE_SIZE}
            paginationText={({ from, to, totalRecords }) => ``}
            page={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </Stack>
  );
};

export default AdminDashboardTable;
