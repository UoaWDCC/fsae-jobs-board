import { Checkbox, Stack } from '@mantine/core';
import classes from './JobBoard.module.css';
import { FC } from 'react';

interface JobFilterProps {
  filterRoles: string[];
  setFilterRoles: (filterRoles: string[]) => void;
  filterFields: string[];
  setFilterFields: (filterFields: string[]) => void;
}
const JobFilter: FC<JobFilterProps> = ({
  filterRoles,
  setFilterRoles,
  filterFields,
  setFilterFields,
}) => {
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
          onChange={setFilterRoles}
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
              size="md"
            />
          ))}
        </Checkbox.Group>
      </Stack>
      <Stack>
        <Checkbox.Group
          value={filterFields}
          onChange={setFilterFields}
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
              size="md"
            />
          ))}
        </Checkbox.Group>
      </Stack>
    </Stack>
  );
};

export default JobFilter;
