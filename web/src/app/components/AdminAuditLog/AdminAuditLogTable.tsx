import { Table, Stack, Text, Pagination, Group } from '@mantine/core';

interface Log {
  id: string;
  details?: { message?: string; [key: string]: any };
  username: string;
  logType: string;
  createdAt: string;
}

interface AdminAuditLogTableProps {
  logs: Log[];
  page: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onRowClick: (log: Log) => void;
}

export default function AdminAuditLogTable({ logs, page, entriesPerPage, onPageChange, onRowClick }: AdminAuditLogTableProps) {
  const totalPages = Math.max(1, Math.ceil(logs.length / entriesPerPage));
  const startIdx = (page - 1) * entriesPerPage;
  const pageData = logs.slice(startIdx, startIdx + entriesPerPage);

  return (
    <Stack justify="center" align="center" gap="md" mt="md">
      <div style={{ width: '100%' }}>
        <Table.ScrollContainer minWidth={500} h={500}>
          <Table stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Message</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageData.map(log => (
                <Table.Tr
                  key={log.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onRowClick(log)}
                >
                  <Table.Td>{log.details?.message}</Table.Td>
                  <Table.Td>{log.username}</Table.Td>
                  <Table.Td>{new Date(log.createdAt).toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
              {pageData.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text ta="center" c="dimmed">
                      No logs match your filters
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
          onChange={onPageChange}
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
}
