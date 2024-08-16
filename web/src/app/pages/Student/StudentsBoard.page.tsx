import { Grid, Divider, useMantineTheme } from '@mantine/core';
import { useState, useEffect } from 'react';
import StudentListing from '../../components/StudentBoard/StudentListing';
import JobFilter from '../../components/JobBoard/JobFilter';
import JobSearch from '../../components/JobBoard/JobSearch';
import classes from '../../components/StudentBoard/StudentBoard.module.css';

export function StudentsBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
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

  return (
    <Grid justify="center" align="center">
      {!isPortrait ? (
        <>
          <Grid.Col span={2} className={classes.filterContainer} mt={120} pl={10}>
            <JobFilter
              filterRoles={filterRoles}
              setFilterRoles={setFilterRoles}
              filterFields={filterFields}
              setFilterFields={setFilterFields}
              color={theme.colors.customPapayaOrange[0]}
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
            <JobSearch
              search={search}
              setSearch={setSearch}
              title="Student Profiles"
              placeholder="Search students"
            />
            <StudentListing />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col span={12}>
          <JobSearch
            search={search}
            setSearch={setSearch}
            title="Student Profiles"
            placeholder="Search students"
          />
          <JobFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            color={theme.colors.customPapayaOrange[0]}
          />
          <StudentListing />
        </Grid.Col>
      )}
    </Grid>
  );
}
