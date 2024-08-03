import { Divider, Flex, TextInput, Title } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';
import classes from '../styles/JobBoardPage.module.css';
import { IconSearch } from '@tabler/icons-react';
import JobSearch from '../components/JobBoard/JobSearch';

export function JobBoard() {
  return (
    <div className={classes.jobBoardContainer}>
      <JobSearch />
      <div className={classes.jobBoardInnerContainer}>
        <JobFilter />
        <Divider orientation="vertical" />
        <JobListing />
      </div>
    </div>
  );
}
