import { SegmentedControl, Text, Flex } from '@mantine/core';
import { FC } from 'react';
import styles from './Filter.module.css';
import { useMediaQuery } from '@mantine/hooks';

interface PostedByFilterProps {
  value: 'all' | 'alumni' | 'sponsors';
  onChange: (value: 'all' | 'alumni' | 'sponsors') => void;
  color?: string;
}

const PostedByFilter: FC<PostedByFilterProps> = ({ value, onChange, color }) => {
  const smallScreen = useMediaQuery('(max-width: 1300px)');
  return (
    <Flex direction="column" gap="xs" style={{ width: '100%' }}>
      <Text size="sm" className={styles.filterSubheading} style={{ color: color }}>Posted By</Text>
      <SegmentedControl
        value={value}
        onChange={(val) => onChange(val as 'all' | 'alumni' | 'sponsors')}
        data={[
          { label: 'All', value: 'all' },
          { label: 'Alumni', value: 'alumni' },
          { label: 'Sponsors', value: 'sponsors' }
        ]}
        size="sm"
        orientation={smallScreen ? 'vertical' : 'horizontal'}
      />
    </Flex>
  );
};

export default PostedByFilter;