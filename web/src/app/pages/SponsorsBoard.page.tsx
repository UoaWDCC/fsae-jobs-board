import { Divider, Grid } from '@mantine/core';
import { useEffect, useState } from 'react';
import SponsorFilter from '../components/SponsorBoard/SponsorFilter';
import SponsorSearch from '../components/SponsorBoard/SponsorSearch';
import SponsorListing from '../components/SponsorBoard/SponsorListing';

export function SponsorsBoard() {
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
            <SponsorFilter
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
            <SponsorSearch search={search} setSearch={setSearch} />
            <SponsorListing filterRoles={filterRoles} filterFields={filterFields} />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col span={12}>
          <SponsorSearch search={search} setSearch={setSearch} />
          <SponsorFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
          />
          <SponsorListing filterRoles={filterRoles} filterFields={filterFields} />
        </Grid.Col>
      )}
    </Grid>
  );
}
