import { Flex, TextInput, Title } from '@mantine/core';
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
    <Flex justify="space-between" align="center" gap="md" mt="md" mr="md">
      <div className={classes.spaceContainer}></div>
      <div className={classes.headingContainer}>
        <Title order={4}>FIND JOBS</Title>
        <TextInput
          placeholder="Search jobs"
          rightSection={<IconSearch />}
          size="md"
          value={search}
          onChange={handleChange}
        />
      </div>
    </Flex>
  );
};

export default JobSearch;
