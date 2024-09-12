import { Grid, TextInput, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { FC, useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  title: string;
  placeholder: string;
}

const SearchBar: FC<SearchBarProps> = ({ search, setSearch, title, placeholder }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  return (
    <Grid mt={90} mb="xs">
      {!isPortrait ? (
        <>
          <Grid.Col pl={30} span={6}>
            <Title order={4}>{title}</Title>
          </Grid.Col>
          <Grid.Col span={6} pr={30}>
            <div className={styles.searchInputContainer}>
              <TextInput
                placeholder={placeholder}
                rightSection={<IconSearch />}
                size="md"
                value={search}
                onChange={handleChange}
                className={styles.searchInput}
              />
            </div>
          </Grid.Col>
        </>
      ) : (
        <Grid.Col pl={30} span={12}>
          <Title order={4}>{title}</Title>

          <TextInput
            placeholder={placeholder}
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

export default SearchBar;
