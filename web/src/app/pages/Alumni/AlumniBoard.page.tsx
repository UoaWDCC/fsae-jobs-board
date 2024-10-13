import { Grid, Divider, useMantineTheme } from '@mantine/core';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from '../../components/StudentBoard/StudentBoard.module.css';
import { ToTopButton } from '../../components/BackToTopButton/BackToTopButton';
import AlumniListing from '../../components/AlumniBoard/AlumniListing';
import AlumniFilter from '../../components/AlumniBoard/AlumniFilter';

export function AlumniBoard() {
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
          <Grid.Col span={2} className={styles.filterContainer} mt={120} pl={10}>
            <AlumniFilter
              filterRoles={filterRoles}
              setFilterRoles={setFilterRoles}
              filterFields={filterFields}
              setFilterFields={setFilterFields}
              useRoles={true}
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
              title="Alumni Board"
              placeholder="Search alumni"
            />
            <AlumniListing />
          </Grid.Col>
          <ToTopButton />
        </>
      ) : (
        <Grid.Col span={12}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            title="Alumni"
            placeholder="Search alumni"
          />
          <AlumniFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            color={theme.colors.customPapayaOrange[0]}
            useRoles={true}
          />
          <AlumniListing />
        </Grid.Col>
      )}
    </Grid>
  );
}
