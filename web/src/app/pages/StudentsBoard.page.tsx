import { Button, Flex, Title, Box, Text, Grid, Divider } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import { useState } from 'react'
import StudentSearch from '../components/StudentBoard/StudentSearch'
import StudentListing from '../components/StudentBoard/StudentListing'

export function StudentsBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  return (
    <Grid justify="center" align="center" >
      <>
        <Grid.Col span={2}>
          <JobFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
          />
        </Grid.Col>
        <Grid.Col span={1} pl={40} style={{ alignSelf: 'stretch' }}>
          <Divider orientation="vertical" size="lg" style={{ height: '90%' }} />
        </Grid.Col>
        <Grid.Col span={9}>
          <StudentSearch search={search} setSearch={setSearch}/>
          <StudentListing />
        </Grid.Col>
      </>
    </Grid>
  );
}
