import { Divider, Grid } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';
import { useEffect, useState } from 'react';
import JobSearch from '../components/JobBoard/JobSearch';

export function JobBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [search, setSearch] = useState<string>('');

  return (
    <Grid justify="center" align="center">
      {!isPortrait ? (
        <>
          <Grid.Col span={2}>
            <JobFilter
              filterRoles={filterRoles}
              setFilterRoles={setFilterRoles}
              filterFields={filterFields}
              setFilterFields={setFilterFields}
            />
          </Grid.Col>
          <Grid.Col span={1} mt={190} pl={40} style={{ alignSelf: 'stretch' }}>
            <Divider orientation="vertical" size="lg" style={{ height: '90%' }} />
          </Grid.Col>
          <Grid.Col span={9}>
            <JobSearch search={search} setSearch={setSearch} title="Job Board" placeholder="Search jobs"/>
            <JobListing filterRoles={filterRoles} filterFields={filterFields} />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col span={12}>
          <JobSearch search={search} setSearch={setSearch} />
          <JobFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
          />
          <JobListing filterRoles={filterRoles} filterFields={filterFields} />
        </Grid.Col>
      )}
    </Grid>
  );
}
