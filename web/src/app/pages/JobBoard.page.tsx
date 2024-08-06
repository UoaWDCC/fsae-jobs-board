import { Divider } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';
import classes from '../styles/JobBoardPage.module.css';
import { useState } from 'react';

export function JobBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);

  return (
    <div className={classes.jobBoardContainer}>
      <div className={classes.leftContainer}>
        <JobFilter
          filterRoles={filterRoles}
          setFilterRoles={setFilterRoles}
          filterFields={filterFields}
          setFilterFields={setFilterFields}
        />
      </div>
      <Divider orientation="vertical" />

      <JobListing filterRoles={filterRoles} filterFields={filterFields} />
    </div>
  );
}
