import { Divider } from '@mantine/core';
import JobFilter from '../components/JobBoard/JobFilter';
import JobListing from '../components/JobBoard/JobListing';
import classes from '../styles/JobBoardPage.module.css';
import { useEffect, useState } from 'react';

export function JobBoard() {
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterFields, setFilterFields] = useState<string[]>([]);

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={classes.jobBoardContainer}>
      {!isPortrait && (
        <div className={classes.leftContainer}>
          <JobFilter
            filterRoles={filterRoles}
            setFilterRoles={setFilterRoles}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
          />
        </div>
      )}

      {!isPortrait && <Divider orientation="vertical" />}

      <JobListing filterRoles={filterRoles} filterFields={filterFields} />
    </div>
  );
}
