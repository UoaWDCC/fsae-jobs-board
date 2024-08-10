import { Grid, TextInput, Title, Container, Group } from '@mantine/core';
import classes from './JobBoard.module.css';
import { IconSearch } from '@tabler/icons-react';
import { FC } from 'react';

interface JobSearchProps {
  search: string;
  setSearch: (search: string) => void;
}

const JobSearch: FC<JobSearchProps> = ({ search, setSearch }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Grid mt={60} mb="xs">
      <Grid.Col pl={30} span={5}>
        <Title order={4}>Job Board</Title>
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          placeholder="Search jobs"
          rightSection={<IconSearch />}
          size="md"
          value={search}
          onChange={handleChange}
        />
      </Grid.Col>
    </Grid>
  );
};

export default JobSearch;
