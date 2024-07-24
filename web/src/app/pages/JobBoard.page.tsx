import { Group } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';

export function JobBoard() {
  return (
    <div
      style={{
        paddingTop: '3rem',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <JobFilter />
      <JobListing />
    </div>
  );
}
