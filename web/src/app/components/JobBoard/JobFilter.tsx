import { Checkbox, Title, Button, Stack, Text, Modal, Flex } from '@mantine/core';
import classes from './JobBoard.module.css';
import { FC, useState } from 'react';
import { IconArrowDown } from '@tabler/icons-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  return (
    <>
      {!isPortrait && (
        <Stack mt={70} pl={30}>
          <Title fs="italic" className={classes.filterHeading}>
            Filters
          </Title>
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
      )}
      {isPortrait && (
        <>
          <Flex justify="flex-end">
            <Button
              rightSection={<IconArrowDown size={14} />}
              variant="transparent"
              size="lg"
              onClick={openModal}
            >
              Filter
            </Button>
          </Flex>
          <Modal
            opened={isModalOpen}
            onClose={closeModal}
            centered
            classNames={{ content: classes.modal, header: classes.modalHeader }}
          >
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
          </Modal>
        </>
      )}
    </>
  );
};

export default JobFilter;
