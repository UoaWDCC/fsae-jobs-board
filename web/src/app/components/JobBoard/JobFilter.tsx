import { Checkbox, Stack } from '@mantine/core';
import classes from './JobBoard.module.css';
import { useState } from 'react';
const JobFilter = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);

  return (
    <Stack className={classes.filterContainer}>
      <p>Filters</p>
      <Stack>
        <p>Role Type</p>
        <Checkbox.Group value={roles} onChange={setRoles}>
          <Checkbox value="internship" label="Internships" />
          <Checkbox value="graduate" label="Graduate Roles" />
          <Checkbox value="junior" label="Junior Roles" />
        </Checkbox.Group>
      </Stack>
      <Stack>
        <p>Fields</p>
        <Checkbox.Group value={fields} onChange={setFields}>
          <Checkbox value="auto" label="Automation" />
          <Checkbox value="electrical" label="Electrical" />
          <Checkbox value="mechanical" label="Mechanical" />
          <Checkbox value="mechatronics" label="Mechatronics" />
          <Checkbox value="software" label="Software" />
          <Checkbox value="other" label="Other" />
        </Checkbox.Group>
      </Stack>
    </Stack>
  );
};

export default JobFilter;
