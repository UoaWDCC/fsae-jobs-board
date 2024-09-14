import { Stack, Table, Text } from '@mantine/core';
import 'mantine-datatable/styles.css';
import styles from './AdminDashboard.module.css';
import { AdminReview } from '@/app/models/adminReview';
import { FC } from 'react';
import { date2string } from '@/app/features/date/dateConverter';
import { DataTable } from 'mantine-datatable';

interface Props {
  data: AdminReview[];
}
const AdminDashboardTable: FC<Props> = ({ data }) => {
  // id: '1',
  // name: 'Google',
  // userType: Role.Alumni,
  // date: new Date(),
  // status: Status.Approved,
  const columns = [
    {
      accessor: 'name',
      cellsClassName: styles.leftRoundedCell,
    },
    {
      accessor: 'userType',
      cellsClassName: styles.tableRow,
    },
    {
      accessor: 'date',
      render: ({ date }) => date2string(date),
      cellsClassName: styles.tableRow,
    },
    {
      accessor: 'status',
      cellsClassName: styles.rightRoundedCell,
    },
  ];
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
        {data && (
          <DataTable
            records={data}
            columns={columns}
            backgroundColor="transparent"
            rowBorderColor="black"
            verticalSpacing="lg"
            c="white"
            rowClassName={styles.tableRow}
          />
        )}
      </div>
    </Stack>
  );
};

export default AdminDashboardTable;
