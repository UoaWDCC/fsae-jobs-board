import { Grid, TextInput, Title } from '@mantine/core';
import classes from './StudentBoard.module.css';
import { IconSearch } from '@tabler/icons-react';

interface StudentSearchProp {
  search: string;
  setSearch: (search: string) => void;
}

const StudentSearch: FC<StudentSearchProp> = ({ search, setSearch }) => {
  return (
    <Grid>
      <>
        <Grid.Col pl={30} span={6}>
          <Title order={4}>Student Profiles</Title>
        </Grid.Col>
        <Grid.Col span={6} pr={30}>
          <TextInput placeholder="Search students" rightSection={<IconSearch/>}
          size="md"
          value={search}
          className={classes.searchBar}
          />
        </Grid.Col>
      </>
    </Grid>
  );
};

export default StudentSearch;
