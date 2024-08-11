import { Grid, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { FC, useState } from 'react';

interface JobSearchProps {
  search: string;
  setSearch: (search: string) => void;
}

const JobSearch: FC<JobSearchProps> = ({ search, setSearch }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  return (
    <Grid mt={70} mb="xs">
      {!isPortrait ? (
        <>
          <Grid.Col pl={30} span={6}>
            <Title order={4}>Job Board</Title>
          </Grid.Col>
          <Grid.Col span={6} pr={30}>
            <TextInput
              placeholder="Search jobs"
              rightSection={<IconSearch />}
              size="md"
              value={search}
              onChange={handleChange}
            />
          </Grid.Col>
        </>
      ) : (
        <Grid.Col pl={30} span={12}>
          <Title order={4}>Job Board</Title>

          <TextInput
            placeholder="Search jobs"
            rightSection={<IconSearch />}
            size="md"
            value={search}
            onChange={handleChange}
            pr={20}
          />
        </Grid.Col>
      )}
    </Grid>
  );
};

export default JobSearch;
