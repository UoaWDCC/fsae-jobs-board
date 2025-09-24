import {useState, useEffect, useCallback} from 'react';
import {Divider, Grid, Modal, Stack, Group, Text, Button, Table} from '@mantine/core';
import {adminApi} from '@/api/admin';
import SearchBar from '@/app/components/SearchBar/SearchBar';
import AdminAuditLogTable from '@/app/components/AdminAuditLog/AdminAuditLogTable';
import AdminAuditLogFilters from '@/app/components/AdminAuditLog/AdminAuditLogFilters';

const LOG_TYPE_OPTIONS = [
  {value: 'log', label: 'Log'},
  {value: 'request', label: 'Request'},
];

const STATUS_OPTIONS = [
  {value: 'pending', label: 'Pending'},
  {value: 'accepted', label: 'Accepted'},
  {value: 'rejected', label: 'Rejected'},
];

export function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [filterLogTypes, setFilterLogTypes] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const entriesPerPage = 8;

  // Dummy filter props for AdminFilter (not used)
  const filterRoles: string[] = [];
  const setfilterRoles = () => {};

  const refresh = useCallback(async () => {
    const raw = await adminApi.getAdminLogs(0, 100); // fetch up to 100 logs
    setLogs(raw);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let f = logs;
    if (filterLogTypes.length > 0) {
      f = f.filter(l => filterLogTypes.includes(l.logType));
    }
    if (filterStatuses.length > 0) {
      f = f.filter(l => filterStatuses.includes(l.status));
    }
    if (search.trim() !== '') {
      f = f.filter(l => l.details?.message?.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredLogs(f);
    setPage(1); // reset page on filter/search change
  }, [logs, filterLogTypes, filterStatuses, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / entriesPerPage));
  const startIdx = (page - 1) * entriesPerPage;
  const pageData = filteredLogs.slice(startIdx, startIdx + entriesPerPage);

  const selectRow = (log: any) => {
    setDetail(log);
    setModalOpen(true);
  };

  // Use new table component
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
        {!isPortrait ? (
          <>
            <Grid.Col span={2} mt={120} pl={10}>
              <AdminAuditLogFilters
                logTypeOptions={LOG_TYPE_OPTIONS}
                statusOptions={STATUS_OPTIONS}
                filterLogTypes={filterLogTypes}
                setFilterLogTypes={setFilterLogTypes}
                filterStatuses={filterStatuses}
                setFilterStatuses={setFilterStatuses}
                isPortrait={false}
              />
            </Grid.Col>
            <Grid.Col span={0.5} pl={40}>
              <Divider orientation="vertical" size="sm" style={{height: '80%'}} mt={160} />
            </Grid.Col>
            <Grid.Col span={9}>
              <SearchBar
                search={search}
                setSearch={setSearch}
                title="Audit Log"
                placeholder="Search Logs"
              />
              {table}
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span={12}>
            <SearchBar
              search={search}
              setSearch={setSearch}
              title="Audit Log"
              placeholder="Search Logs"
            />
            <AdminAuditLogFilters
              logTypeOptions={LOG_TYPE_OPTIONS}
              statusOptions={STATUS_OPTIONS}
              filterLogTypes={filterLogTypes}
              setFilterLogTypes={setFilterLogTypes}
              filterStatuses={filterStatuses}
              setFilterStatuses={setFilterStatuses}
              isPortrait={true}
            />
            {table}
          </Grid.Col>
        )}
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
            <Divider my="sm" />
            <Text fw={700}>Username:</Text>
            <Text>{detail.username}</Text>
            <Divider my="sm" />
            <Text fw={700}>Log Type:</Text>
            <Text>{detail.logType}</Text>
            <Divider my="sm" />
            <Text fw={700}>Date:</Text>
            <Text>{new Date(detail.createdAt).toLocaleString()}</Text>
            <Divider my="sm" />
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
