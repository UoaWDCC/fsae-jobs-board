import { Divider, Grid, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import Filter from '../../components/Filter/Filter';
import SearchBar from '../../components/SearchBar/SearchBar';
import SponsorListing from '../../components/SponsorBoard/SponsorListing';

export function SponsorsBoard() {
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
    <Grid justify="center" align="flex-start">
      {!isPortrait ? (
        <>
          <Grid.Col span={2} mt={120} pl={10}>
            <Filter
              filterRoles={filterRoles}
              setFilterRoles={setFilterRoles}
              filterFields={filterFields}
              setFilterFields={setFilterFields}
              color={theme.colors.customAzureBlue[1]}
              useRoles={false}
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
              title={'SPONSORS'}
              placeholder={'Search Sponsors'}
            />
            <SponsorListing filterRoles={filterRoles} filterFields={filterFields} />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col span={12}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            title={'SPONSORS'}
            placeholder={'Search Sponsors'}
          />
          <Filter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            color={theme.colors.customAzureBlue[1]}
          />
          <SponsorListing filterRoles={filterRoles} filterFields={filterFields} />
        </Grid.Col>
      )}
    </Grid>
  );
}
