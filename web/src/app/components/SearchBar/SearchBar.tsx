import { Grid, TextInput, Title, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { FC, useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  title: string;
  placeholder: string;
  onSearch: () => void; // <-- Add this
}

const SearchBar: FC<SearchBarProps> = ({ search, setSearch, title, placeholder, onSearch }) => {
  const [input, setInput] = useState(search);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearch(input);
      onSearch();
    }
  };

  const handleSearchClick = () => {
    setSearch(input);
    onSearch();
  };

  return (
    <Grid mt={90} mb="xs">
      <Grid.Col span={12}>
        <Title order={4}>{title}</Title>
        <TextInput
          placeholder={placeholder}
          rightSection={
            <Button variant="subtle" onClick={handleSearchClick} px={6}>
              <IconSearch />
            </Button>
          }
          size="md"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          pr={20}
        />
      </Grid.Col>
    </Grid>
  );
};

export default SearchBar;
