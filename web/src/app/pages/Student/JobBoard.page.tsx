import { Divider, Grid, useMantineTheme } from '@mantine/core';
import Filter from '../../components/Filter/Filter';
import JobListing from '../../components/JobBoard/JobListing';
import { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import { ToTopButton } from '../../components/BackToTopButton/BackToTopButton';

export function JobBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const theme = useMantineTheme();

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
          <ToTopButton />
          <Grid.Col span={2}>
            <Filter
              filterRoles={filterRoles}
              setFilterRoles={setFilterRoles}
              filterFields={filterFields}
              setFilterFields={setFilterFields}
            />
          </Grid.Col>
          <Grid.Col span={0.5} pl={40} style={{ alignSelf: 'stretch' }}>
            <Divider
              orientation="vertical"
              size="sm"
              style={{ height: '80%' }}
              mt={160}
              color={theme.colors.customWhite[0]}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <SearchBar
              search={search}
              setSearch={setSearch}
              title="Job Board"
              placeholder="Search jobs"
            />
            <JobListing filterRoles={filterRoles} filterFields={filterFields} />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col span={12}>
          <SearchBar search={search} setSearch={setSearch} title={''} placeholder={''} />
          <Filter
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
