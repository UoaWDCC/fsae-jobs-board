import { Divider } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';
import classes from '../styles/JobBoardPage.module.css';
import JobSearch from '../components/JobBoard/JobSearch';
import { useState } from 'react';

export function JobBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);

  return (
    <div className={classes.jobBoardContainer}>
      <JobSearch />
      <div className={classes.jobBoardInnerContainer}>
        <JobFilter
          filterRoles={filterRoles}
          setFilterRoles={setFilterRoles}
          filterFields={filterFields}
          setFilterFields={setFilterFields}
        />
        <Divider orientation="vertical" />
        <JobListing />
      </div>
    </div>
  );
}
