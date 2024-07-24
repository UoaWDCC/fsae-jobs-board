import { Group } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';

export function JobBoard() {
  return (
    <div style={{ paddingTop: '3rem' }}>
      <Group>
        <JobFilter />
        <JobListing />
      </Group>
    </div>
  );
}
