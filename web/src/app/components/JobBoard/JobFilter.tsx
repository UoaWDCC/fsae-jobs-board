import { Checkbox, Stack } from '@mantine/core';
import classes from './JobBoard.module.css';
import { useState } from 'react';
const JobFilter = () => {
  const [filterRoles, setfilterRoles] = useState<string[]>([]);
  const [filterFields, setfilterFields] = useState<string[]>([]);

  const roles = [
    { value: 'internship', label: 'Internship' },
    { value: 'graduate', label: 'Graduate Roles' },
    { value: 'junior', label: 'Junior Roles' },
  ];

  const fields = [
    { value: 'auto', label: 'Automation' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'mechatronics', label: 'Mechatronics' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Stack className={classes.filterContainer}>
      <em className={classes.filterHeading}>Filters</em>
      <Stack>
        <Checkbox.Group
          value={filterRoles}
          onChange={setfilterRoles}
          label="Role Type"
          classNames={{ label: classes.filterSubheading }}
        >
          {roles.map((role) => (
            <Checkbox
              key={role.value}
              value={role.value}
              label={role.label}
              color="customAzureBlue.1"
              className={classes.checkbox}
            />
          ))}
        </Checkbox.Group>
      </Stack>
      <Stack>
        <Checkbox.Group
          value={filterFields}
          onChange={setfilterFields}
          label="Fields"
          classNames={{ label: classes.filterSubheading }}
        >
          {fields.map((role) => (
            <Checkbox
              key={role.value}
              value={role.value}
              label={role.label}
              color="customAzureBlue.1"
              className={classes.checkbox}
            />
          ))}
        </Checkbox.Group>
      </Stack>
    </Stack>
  );
};

export default JobFilter;
