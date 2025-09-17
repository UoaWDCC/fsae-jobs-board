import {useState, useEffect, useCallback} from 'react';
import {Divider, Grid, Modal, Table, Stack, Pagination, Group, Text, Button, Checkbox, Title} from '@mantine/core';
import {adminApi} from '@/api/admin';
import AdminFilter from '@/app/components/Filter/AdminFilter';
import SearchBar from '@/app/components/SearchBar/SearchBar';

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

  // Table styled similar to AdminDashboardTable
  const table = (
    <Stack justify="center" align="center" gap="md" mt="md">
      <div style={{width: '100%'}}>
        <Table.ScrollContainer minWidth={500} h={500}>
          <Table stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Message</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Log Type</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageData.map(log => (
                <Table.Tr
                  key={log.id}
                  style={{cursor: 'pointer'}}
                  onClick={() => selectRow(log)}
                >
                  <Table.Td>
                    {log.details?.message}
                  </Table.Td>
                  <Table.Td>
                    {log.username}
                  </Table.Td>
                  <Table.Td>
                    {log.logType.charAt(0).toUpperCase() + log.logType.slice(1)}
                  </Table.Td>
                  <Table.Td>
                    {new Date(log.createdAt).toLocaleString()}
                  </Table.Td>
                </Table.Tr>
              ))}
              {pageData.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
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
          onChange={setPage}
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

  return (
    <>
      <Grid justify="center" align="flex-start">
        {!isPortrait ? (
          <>
            <Grid.Col span={2} mt={120} pl={10}>
              <Stack>
                <Title fs="italic" c="white" fz="lg"> Filters</Title>
                <Text fw={700} size="lg" mb={4} c="blue.6">Log Type</Text>
                {LOG_TYPE_OPTIONS.map(opt => (
                  <Checkbox
                    key={opt.value}
                    label={<Text size="md" fw={500} c="white">{opt.label}</Text>}
                    checked={filterLogTypes.includes(opt.value)}
                    onChange={e => {
                      setFilterLogTypes(val =>
                        e.target.checked
                          ? [...val, opt.value]
                          : val.filter(v => v !== opt.value)
                      );
                    }}
                    size="md"
                    color="blue"
                    radius="md"
                    mb={8}
                  />
                ))}
                <Text fw={700} size="sm" mb={4} mt={16} c="blue.6">Request Status</Text>
                {STATUS_OPTIONS.map(opt => (
                  <Checkbox
                    key={opt.value}
                    label={<Text size="md" fw={500} c="white">{opt.label}</Text>}
                    checked={filterStatuses.includes(opt.value)}
                    onChange={e => {
                      setFilterStatuses(val =>
                        e.target.checked
                          ? [...val, opt.value]
                          : val.filter(v => v !== opt.value)
                      );
                    }}
                    size="md"
                    color="blue"
                    radius="md"
                    mb={8}
                  />
                ))}
              </Stack>
            </Grid.Col>
            <Grid.Col span={0.5} pl={40}>
              <Divider orientation="vertical" size="sm" style={{height: '80%'}} mt={160} />
            </Grid.Col>
            <Grid.Col span={9}>
              <SearchBar
                search={search}
                setSearch={setSearch}
                title="AUDIT LOG"
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
              title="AUDIT LOG"
              placeholder="Search Logs"
            />
            <Stack>
              <Text fw={700} size="lg" mb={12} c="white" style={{letterSpacing: 1}}>Filter</Text>
              <Text fw={700} size="sm" mb={4} c="blue.6">Log Type</Text>
              {LOG_TYPE_OPTIONS.map(opt => (
                <Checkbox
                  key={opt.value}
                  label={<Text size="sm" fw={500} c="gray.8">{opt.label}</Text>}
                  checked={filterLogTypes.includes(opt.value)}
                  onChange={e => {
                    setFilterLogTypes(val =>
                      e.target.checked
                        ? [...val, opt.value]
                        : val.filter(v => v !== opt.value)
                    );
                  }}
                  size="md"
                  color="blue"
                  radius="md"
                  mb={8}
                />
              ))}
              <Text fw={700} size="sm" mb={4} mt={16} c="blue.6">Request Status</Text>
              {STATUS_OPTIONS.map(opt => (
                <Checkbox
                  key={opt.value}
                  label={<Text size="sm" fw={500} c="gray.8">{opt.label}</Text>}
                  checked={filterStatuses.includes(opt.value)}
                  onChange={e => {
                    setFilterStatuses(val =>
                      e.target.checked
                        ? [...val, opt.value]
                        : val.filter(v => v !== opt.value)
                    );
                  }}
                  size="md"
                  color="blue"
                  radius="md"
                  mb={8}
                />
              ))}
            </Stack>
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
