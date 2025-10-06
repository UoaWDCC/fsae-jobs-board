import {useState, useEffect, useCallback} from 'react';
import {Grid, Modal, Stack, Text, Button, Table} from '@mantine/core';
import {adminApi} from '@/api/admin';
import SearchBar from '@/app/components/SearchBar/SearchBar';
import AdminAuditLogTable from '@/app/components/AdminAuditLog/AdminAuditLogTable';
import { IconRefresh } from '@tabler/icons-react'; // added import

export function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const entriesPerPage = 8;

  const refresh = useCallback(async () => {
    const raw = await adminApi.getAdminLogs(0, 100);
    setLogs(raw);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    let f = logs;
    if (search.trim() !== '') {
      f = f.filter(l => l.details?.message?.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredLogs(f);
    setPage(1);
  }, [logs, search]);

  const selectRow = (log: any) => {
    setDetail(log);
    setModalOpen(true);
  };

  const table = (
    <AdminAuditLogTable
      logs={filteredLogs}
      page={page}
      entriesPerPage={entriesPerPage}
      onPageChange={setPage}
      onRowClick={selectRow}
    />
  );

  return (
    <>
      <Grid justify="center" align="flex-start">
        <Grid.Col span={12} px={40}>
          {/* Compact flex row: search expands/shrinks, refresh button stays fixed to the right */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <SearchBar
                search={search}
                setSearch={setSearch}
                title="Audit Log"
                placeholder="Search Logs"
              />
            </div>

            <div style={{ flex: '0 0 auto' }}>
              <Button
                onClick={refresh}
                size="sm"
                
                title="Refresh logs"
                aria-label="Refresh logs"
              >
                <IconRefresh size={16} />
              </Button>
            </div>
          </div>

          {table}
        </Grid.Col>
      </Grid>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Details"
        size="lg"
        centered
      >
        {detail && (
          <Stack>
            <Text fw={700}>Message:</Text>
            <Text>{detail.details?.message}</Text>
            <Text fw={700}>Username:</Text>
            <Text>{detail.username}</Text>
            <Text fw={700}>Date:</Text>
            <Text>{new Date(detail.createdAt).toLocaleString()}</Text>
            <Text fw={700}>All Details:</Text>
            <Table>
              <Table.Tbody>
                {Object.entries(detail.details || {}).map(([key, value]) => (
                  <Table.Tr key={key}>
                    <Table.Td fw={700}>{key}</Table.Td>
                    <Table.Td>{String(value)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Button mt="md" onClick={() => setModalOpen(false)}>Close</Button>
          </Stack>
        )}
      </Modal>
    </>
  );
}